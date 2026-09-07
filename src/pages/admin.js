import { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from 'components/Header';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { colors, fonts } from 'styles/tokens';
const PageRoot = styled.div`
  min-height: 100vh;
  background: ${colors.paper};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Card = styled.div`
  background: ${colors.white};
  border: 2px solid ${colors.ink};
  box-shadow: 8px 8px 0 ${colors.sky};
  padding: 40px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-size: 2.5rem;
  margin: 0 0 24px;
`;

const Input = styled.input`
  padding: 14px;
  font-family: ${fonts.mono};
  font-size: 1rem;
  border: 2px solid ${colors.ink};
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.orange};
  }
`;

const TextArea = styled.textarea`
  padding: 14px;
  font-family: ${fonts.sans};
  font-size: 1rem;
  border: 2px solid ${colors.ink};
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.orange};
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  background: ${colors.orange};
  color: ${colors.white};
  border: 2px solid ${colors.ink};
  font-family: ${fonts.mono};
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 4px 4px 0 ${colors.maroon};
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 ${colors.maroon};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const TabButton = styled(Button)`
  background: ${(props) => (props.$active ? colors.orange : colors.white)};
  color: ${(props) => (props.$active ? colors.white : colors.ink)};
  box-shadow: 4px 4px 0 ${(props) => (props.$active ? colors.maroon : colors.sky)};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: ${fonts.sans};
  
  th, td {
    border: 1px solid ${colors.ink};
    padding: 12px;
    text-align: left;
  }
  
  th {
    background: ${colors.sky};
    font-weight: bold;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    font-weight: 700;
    margin-bottom: 8px;
    font-family: ${fonts.mono};
  }
`;

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState('sdg'); // 'sdg' or 'mxesa'

  // SDG State
  const [sdgTeams, setSdgTeams] = useState([]);

  // MXESA Team State
  const [mxesaTeam, setMxesaTeam] = useState([]);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    id: null,
    name: '',
    role: '',
    description: '',
    photo: '',
    order: 0,
    socials: { instagram: '', linkedin: '', github: '' }
  });

  const API_BASE = process.env.NEXT_PUBLIC_SDG_API_BASE_URL || '';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'mxesa_admin_authorized') {
      setIsLoggedIn(true);
      fetchAllData(token);
    }
  }, []);

  const fetchAllData = (token) => {
    fetchSdgTeams(token);
    fetchMxesaTeam();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'mxesa_admin' && password === 'mmit@134') {
      localStorage.setItem('admin_token', 'mxesa_admin_authorized');
      setIsLoggedIn(true);
      setError('');
      fetchAllData('mxesa_admin_authorized');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setSdgTeams([]);
    setMxesaTeam([]);
  };

  const fetchSdgTeams = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sdg/admin/teams`, {
        headers: { 'Authorization': `Admin ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSdgTeams(data.teams);
      } else {
        console.error('Failed to fetch SDG teams');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMxesaTeam = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'mxesa_team'));
      const members = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMxesaTeam(members);
    } catch (err) {
      console.error('Error fetching MXESA team:', err);
    }
  };

  const resetMemberForm = () => {
    setIsEditingMember(false);
    setMemberForm({
      id: null,
      name: '',
      role: '',
      description: '',
      photo: '',
      order: 0,
      socials: { instagram: '', linkedin: '', github: '' }
    });
  };

  const handleEditMemberClick = (member) => {
    setMemberForm({
      id: member.id,
      name: member.name || '',
      role: member.role || '',
      description: member.description || '',
      photo: member.photo || '',
      order: member.order || 0,
      socials: {
        instagram: member.socials?.instagram || '',
        linkedin: member.socials?.linkedin || '',
        github: member.socials?.github || ''
      }
    });
    setIsEditingMember(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    const isNew = !memberForm.id;

    try {
      const dataToSave = { ...memberForm };
      delete dataToSave.id; // Don't save the id inside the document

      if (isNew) {
        await addDoc(collection(db, 'mxesa_team'), dataToSave);
        alert('Member added!');
      } else {
        await updateDoc(doc(db, 'mxesa_team', memberForm.id), dataToSave);
        alert('Member updated!');
      }
      resetMemberForm();
      fetchMxesaTeam();
    } catch (err) {
      console.error(err);
      alert('Error saving member');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await deleteDoc(doc(db, 'mxesa_team', id));
      alert('Member deleted!');
      fetchMxesaTeam();
    } catch (err) {
      console.error(err);
      alert('Error deleting member');
    }
  };

  if (!isLoggedIn) {
    return (
      <PageRoot>
        <Head><title>Admin Login | MXESA</title></Head>
        <Header standalone />
        <MainContent style={{ maxWidth: '480px', display: 'flex', alignItems: 'center' }}>
          <Card style={{ width: '100%' }}>
            <Title>Admin Login</Title>
            {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
            <form onSubmit={handleLogin}>
              <Input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button type="submit" style={{ width: '100%' }}>Login</Button>
            </form>
          </Card>
        </MainContent>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <Head><title>Admin Dashboard | MXESA</title></Head>
      <Header standalone />
      <MainContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title style={{ margin: 0 }}>Admin Dashboard</Title>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        <TabContainer>
          <TabButton $active={activeTab === 'sdg'} onClick={() => setActiveTab('sdg')}>
            SDG Ideathon Teams
          </TabButton>
          <TabButton $active={activeTab === 'mxesa'} onClick={() => setActiveTab('mxesa')}>
            MXESA Team Members
          </TabButton>
        </TabContainer>
        
        {activeTab === 'sdg' && (
          <Card>
            <h2>SDG Ideathon Teams</h2>
            {loading ? (
              <p>Loading teams...</p>
            ) : sdgTeams.length === 0 ? (
              <p>No teams registered yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Track</th>
                      <th>Members</th>
                      <th>Idea Title</th>
                      <th>Phase 1 Description</th>
                      <th>Demo Video</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sdgTeams.map(team => (
                      <tr key={team.id}>
                        <td>{team.name}</td>
                        <td>{team.sdg_track}</td>
                        <td>
                          {team.members?.map(m => m.name || m.email).join(', ')}
                        </td>
                        <td>{team.submission?.idea_title || '-'}</td>
                        <td>{team.submission?.phase1_description || '-'}</td>
                        <td>
                          {team.submission?.demo_video_link ? (
                            <a href={team.submission.demo_video_link} target="_blank" rel="noreferrer" style={{ color: colors.orange, textDecoration: 'underline' }}>
                              Watch Link
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'mxesa' && (
          <>
            {!isEditingMember ? (
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>MXESA Team Directory</h2>
                  <Button onClick={() => setIsEditingMember(true)}>+ Add Member</Button>
                </div>
                
                {mxesaTeam.length === 0 ? (
                  <p>No team members added yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Photo</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Socials</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mxesaTeam.map(member => (
                          <tr key={member.id}>
                            <td>{member.order}</td>
                            <td>
                              {member.photo ? <img src={member.photo} alt={member.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} /> : 'No Photo'}
                            </td>
                            <td>{member.name}</td>
                            <td>{member.role}</td>
                            <td>
                              {member.socials?.instagram && <a href={member.socials.instagram} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>IG</a>}
                              {member.socials?.linkedin && <a href={member.socials.linkedin} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>IN</a>}
                              {member.socials?.github && <a href={member.socials.github} target="_blank" rel="noreferrer">GH</a>}
                            </td>
                            <td>
                              <button onClick={() => handleEditMemberClick(member)} style={{ marginRight: 8, cursor: 'pointer' }}>Edit</button>
                              <button onClick={() => handleDeleteMember(member.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card>
            ) : (
              <Card>
                <h2>{memberForm.id ? 'Edit Member' : 'Add New Member'}</h2>
                <form onSubmit={handleSaveMember}>
                  <FormGroup>
                    <label>Name</label>
                    <Input required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} />
                  </FormGroup>
                  <FormGroup>
                    <label>Role</label>
                    <Input required value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} placeholder="e.g. President, Core Member" />
                  </FormGroup>
                  <FormGroup>
                    <label>Description</label>
                    <TextArea value={memberForm.description} onChange={e => setMemberForm({...memberForm, description: e.target.value})} />
                  </FormGroup>
                  <FormGroup>
                    <label>Photo URL</label>
                    <Input value={memberForm.photo} onChange={e => setMemberForm({...memberForm, photo: e.target.value})} placeholder="https://..." />
                  </FormGroup>
                  <FormGroup>
                    <label>Display Order (Lowest first)</label>
                    <Input type="number" value={memberForm.order} onChange={e => setMemberForm({...memberForm, order: e.target.value})} />
                  </FormGroup>
                  <FormGroup>
                    <label>Instagram URL</label>
                    <Input value={memberForm.socials.instagram} onChange={e => setMemberForm({...memberForm, socials: {...memberForm.socials, instagram: e.target.value}})} />
                  </FormGroup>
                  <FormGroup>
                    <label>LinkedIn URL</label>
                    <Input value={memberForm.socials.linkedin} onChange={e => setMemberForm({...memberForm, socials: {...memberForm.socials, linkedin: e.target.value}})} />
                  </FormGroup>
                  <FormGroup>
                    <label>GitHub URL</label>
                    <Input value={memberForm.socials.github} onChange={e => setMemberForm({...memberForm, socials: {...memberForm.socials, github: e.target.value}})} />
                  </FormGroup>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button type="submit">Save Member</Button>
                    <Button type="button" onClick={resetMemberForm} style={{ background: colors.paper, color: colors.ink }}>Cancel</Button>
                  </div>
                </form>
              </Card>
            )}
          </>
        )}
      </MainContent>
    </PageRoot>
  );
}
