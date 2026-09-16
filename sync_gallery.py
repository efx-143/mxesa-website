import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase
cred = credentials.Certificate("mxesa-71835-firebase-adminsdk-fbsvc-738b3baf56.json")
try:
    firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()

folder = 'public/gallery/inauguration'
images = []

if os.path.exists(folder):
    for filename in sorted(os.listdir(folder)):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            images.append({
                'filename': filename,
                'category': 'group', # default category
                'order': 999
            })

# Save to Firestore
doc_ref = db.collection('gallery').document('inauguration')
doc_ref.set({'images': images})
print(f"Synced {len(images)} images to Firestore.")
