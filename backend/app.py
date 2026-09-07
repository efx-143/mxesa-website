import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt
import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)

@app.errorhandler(Exception)
def handle_exception(e):
    # Pass through HTTP errors
    if hasattr(e, 'code'):
        return jsonify(error=f"{str(e)} (Path seen by Flask: {request.path})"), e.code
    # Return JSON instead of HTML for non-HTTP errors
    return jsonify(error=f"{str(e)} (Path seen by Flask: {request.path})", type=type(e).__name__), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        'error': '404 Not Found',
        'path': request.path,
        'full_path': request.full_path,
        'script_root': request.script_root,
        'base_url': request.base_url
    }), 404

import json

# Initialize Firebase Admin
# It will use FIREBASE_CREDENTIALS env var containing the JSON string,
# or default credentials if none provided (like GOOGLE_APPLICATION_CREDENTIALS for local).
try:
    firebase_credentials = os.environ.get('FIREBASE_CREDENTIALS')
    if firebase_credentials:
        cert_dict = json.loads(firebase_credentials, strict=False)
        cred = credentials.Certificate(cert_dict)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    print("Warning: Firebase admin not initialized correctly:", e)
    db = None

JWT_SECRET = os.environ.get('JWT_SECRET', 'super-secret-key-for-jwt')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

def verify_token(req):
    auth_header = req.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

def get_user_team(uid):
    teams_ref = db.collection('sdg_teams')
    # Since members is an array of dicts, it's easier to maintain a member_uids array for querying
    query = teams_ref.where('member_uids', 'array_contains', uid).limit(1).stream()
    for doc in query:
        team = doc.to_dict()
        team['id'] = doc.id
        return team
    return None

@app.route('/api/sdg/teams/my_team', methods=['GET'])
def my_team():
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
        
    team = get_user_team(user['uid'])
    if team:
        return jsonify({'team': team}), 200
    else:
        return jsonify({'error': 'No team found'}), 404

@app.route('/api/sdg/teams', methods=['POST'])
def create_team():
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
        
    data = request.json
    team_name = data.get('team_name')
    sdg_track = data.get('sdg_track')
    
    if not team_name or not sdg_track:
        return jsonify({'error': 'Missing team_name or sdg_track'}), 400
        
    existing_team = get_user_team(user['uid'])
    if existing_team:
        return jsonify({'error': 'You already have a team'}), 400
        
    team_data = {
        'name': team_name,
        'sdg_track': sdg_track,
        'leader_uid': user['uid'],
        'member_uids': [user['uid']],
        'members': [{
            'uid': user['uid'],
            'email': user.get('email', ''),
            'name': user.get('name', '')
        }],
        'submission': None,
        'created_at': firestore.SERVER_TIMESTAMP
    }
    
    db.collection('sdg_teams').add(team_data)
    
    return jsonify({'message': 'Team created successfully'}), 201

def send_email(to_email, invite_url, team_name):
    sender = os.environ.get('GMAIL_USER')
    password = os.environ.get('GMAIL_PASS')
    
    if not sender or not password:
        print(f"Would have sent email to {to_email} for {team_name} with URL: {invite_url}")
        print("Please configure GMAIL_USER and GMAIL_PASS in .env")
        return
        
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = to_email
    msg['Subject'] = f"Invitation to join {team_name} - SDG Ideathon"
    
    body = f"""Hello,
    
You have been invited to join the team '{team_name}' for the SDG Ideathon!
Click the link below to accept the invitation:

{invite_url}

Good luck!
"""
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender, password)
        text = msg.as_string()
        server.sendmail(sender, to_email, text)
        server.quit()
    except Exception as e:
        print("Failed to send email:", e)
        raise e

@app.route('/api/sdg/teams/<team_id>/invite', methods=['POST'])
def invite_member(team_id):
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
        
    team_ref = db.collection('sdg_teams').document(team_id)
    team = team_ref.get()
    
    if not team.exists:
        return jsonify({'error': 'Team not found'}), 404
        
    team_data = team.to_dict()
    
    if team_data.get('leader_uid') != user['uid']:
        return jsonify({'error': 'Only the leader can invite members'}), 403
        
    if len(team_data.get('members', [])) >= 3:
        return jsonify({'error': 'Team is already full (max 3 members)'}), 400
        
    email = request.json.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
        
    # Generate JWT token
    exp = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    token = jwt.encode({'team_id': team_id, 'email': email, 'exp': exp}, JWT_SECRET, algorithm='HS256')
    
    invite_url = f"{FRONTEND_URL}/sdg-join?token={token}"
    
    try:
        send_email(email, invite_url, team_data.get('name'))
        return jsonify({'message': 'Invitation sent'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to send email'}), 500

@app.route('/api/sdg/teams/join', methods=['POST'])
def join_team():
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
        
    token = request.json.get('token')
    if not token:
        return jsonify({'error': 'Missing token'}), 400
        
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        team_id = payload.get('team_id')
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Invitation expired'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 400
        
    existing_team = get_user_team(user['uid'])
    if existing_team:
        return jsonify({'error': 'You are already in a team'}), 400
        
    team_ref = db.collection('sdg_teams').document(team_id)
    team = team_ref.get()
    
    if not team.exists:
        return jsonify({'error': 'Team not found'}), 404
        
    team_data = team.to_dict()
    if len(team_data.get('members', [])) >= 3:
        return jsonify({'error': 'Team is full'}), 400
        
    member_uids = team_data.get('member_uids', [])
    if user['uid'] in member_uids:
        return jsonify({'message': 'Already a member'}), 200
        
    member_uids.append(user['uid'])
    members = team_data.get('members', [])
    members.append({
        'uid': user['uid'],
        'email': user.get('email', ''),
        'name': user.get('name', '')
    })
    
    team_ref.update({
        'member_uids': member_uids,
        'members': members
    })
    
    return jsonify({'message': 'Successfully joined the team'}), 200

@app.route('/api/sdg/teams/<team_id>/submission', methods=['POST'])
def submit_idea(team_id):
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
        
    team_ref = db.collection('sdg_teams').document(team_id)
    team = team_ref.get()
    
    if not team.exists:
        return jsonify({'error': 'Team not found'}), 404
        
    team_data = team.to_dict()
    if team_data.get('leader_uid') != user['uid']:
        return jsonify({'error': 'Only the leader can update the submission'}), 403
        
    data = request.json
    submission = {
        'idea_title': data.get('idea_title', ''),
        'phase1_description': data.get('phase1_description', ''),
        'demo_video_link': data.get('demo_video_link', '')
    }
    
    team_ref.update({'submission': submission})
    
    return jsonify({'message': 'Submission updated successfully'}), 200

@app.route('/api/sdg/admin/teams', methods=['GET'])
def get_all_teams():
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != 'Admin mxesa_admin_authorized':
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        teams = []
        teams_ref = db.collection('sdg_teams')
        for doc in teams_ref.stream():
            team = doc.to_dict()
            team['id'] = doc.id
            teams.append(team)
        return jsonify({'teams': teams}), 200
    except Exception as e:
        print("Error fetching teams for admin:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'firebase_initialized': db is not None,
        'has_credentials_env': bool(os.environ.get('FIREBASE_CREDENTIALS')),
        'frontend_url': FRONTEND_URL
    }), 200

# --- MXESA Team API ---

@app.route('/api/mxesa_team', methods=['GET'])
def get_mxesa_team():
    try:
        members = []
        members_ref = db.collection('mxesa_team').order_by('order')
        for doc in members_ref.stream():
            member = doc.to_dict()
            member['id'] = doc.id
            members.append(member)
        return jsonify({'members': members}), 200
    except Exception as e:
        print("Error fetching MXESA team:", e)
        return jsonify({'error': 'Internal server error'}), 500

def verify_admin_token(req):
    auth_header = req.headers.get('Authorization')
    if not auth_header or auth_header != 'Admin mxesa_admin_authorized':
        return False
    return True

@app.route('/api/admin/mxesa_team', methods=['POST'])
def add_mxesa_member():
    if not verify_admin_token(request):
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        data = request.json
        member_data = {
            'name': data.get('name', ''),
            'role': data.get('role', ''),
            'description': data.get('description', ''),
            'photo': data.get('photo', ''),
            'order': int(data.get('order', 0)),
            'socials': {
                'instagram': data.get('socials', {}).get('instagram', ''),
                'linkedin': data.get('socials', {}).get('linkedin', ''),
                'github': data.get('socials', {}).get('github', '')
            }
        }
        doc_ref = db.collection('mxesa_team').document()
        doc_ref.set(member_data)
        member_data['id'] = doc_ref.id
        return jsonify({'message': 'Member added successfully', 'member': member_data}), 201
    except Exception as e:
        print("Error adding member:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/admin/mxesa_team/<member_id>', methods=['PUT'])
def edit_mxesa_member(member_id):
    if not verify_admin_token(request):
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        data = request.json
        member_data = {
            'name': data.get('name', ''),
            'role': data.get('role', ''),
            'description': data.get('description', ''),
            'photo': data.get('photo', ''),
            'order': int(data.get('order', 0)),
            'socials': {
                'instagram': data.get('socials', {}).get('instagram', ''),
                'linkedin': data.get('socials', {}).get('linkedin', ''),
                'github': data.get('socials', {}).get('github', '')
            }
        }
        db.collection('mxesa_team').document(member_id).update(member_data)
        member_data['id'] = member_id
        return jsonify({'message': 'Member updated successfully', 'member': member_data}), 200
    except Exception as e:
        print("Error updating member:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/admin/mxesa_team/<member_id>', methods=['DELETE'])
def delete_mxesa_member(member_id):
    if not verify_admin_token(request):
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        db.collection('mxesa_team').document(member_id).delete()
        return jsonify({'message': 'Member deleted successfully'}), 200
    except Exception as e:
        print("Error deleting member:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'])
def catch_all(path):
    return jsonify({
        'error': f'404 Not Found (Catch-All). Path received: /{path}',
        'request_path': request.path
    }), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
