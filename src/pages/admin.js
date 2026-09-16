import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from 'components/Header';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
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
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // MXESA Team State
  const [mxesaTeam, setMxesaTeam] = useState([]);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    id: null,
    name: '',
    role: '',
    description: '',
    photo: '',
    socials: { instagram: '', linkedin: '', github: '' }
  });

  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = React.useRef(null);
  const [isUploading, setIsUploading] = useState(false);

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
      socials: { instagram: '', linkedin: '', github: '' }
    });
    setImgSrc('');
    setCompletedCrop(null);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleUploadCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsUploading(true);

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio || 1;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append('image', blob);

      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=3d7be5df36153d070e833437a3434fa8`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setMemberForm(prev => ({ ...prev, photo: data.data.url }));
          setImgSrc('');
          setCompletedCrop(null);
          alert('Image uploaded successfully!');
        } else {
          alert('Upload failed');
        }
      } catch (err) {
        console.error(err);
        alert('Error uploading');
      } finally {
        setIsUploading(false);
      }
    }, 'image/jpeg', 1.0);
  };

  const handleEditMemberClick = (member) => {
    setMemberForm({
      id: member.id,
      name: member.name || '',
      role: member.role || '',
      description: member.description || '',
      photo: member.photo || '',
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

  const downloadCSV = () => {
    const headers = ['Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'Members', 'SDG Track', 'Idea Title', 'Phase 1 Description', 'Video Link'];
    const rows = sdgTeams.map(team => {
      const leader = team.members?.find(m => m.uid === team.leader_uid) || {};
      const membersStr = team.members?.map(m => `${m.name} (${m.email})`).join('; ') || '';
      return [
        `"${(team.name || '').replace(/"/g, '""')}"`,
        `"${(leader.name || '').replace(/"/g, '""')}"`,
        `"${(leader.email || '').replace(/"/g, '""')}"`,
        `"${(team.leader_phone || '').replace(/"/g, '""')}"`,
        `"${membersStr.replace(/"/g, '""')}"`,
        `"${(team.sdg_track || '').replace(/"/g, '""')}"`,
        `"${(team.submission?.idea_title || '').replace(/"/g, '""')}"`,
        `"${(team.submission?.phase1_description || '').replace(/"/g, '""')}"`,
        `"${(team.submission?.demo_video_link || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sdg_teams.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSdgTeam = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this SDG team?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/sdg/admin/teams/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Admin ${token}` }
      });
      if (res.ok) {
        alert('Team deleted!');
        fetchSdgTeams(token);
      } else {
        alert('Failed to delete team');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting team');
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>SDG Ideathon Teams</h2>
              <Button onClick={downloadCSV}>Download CSV</Button>
            </div>
            {loading ? (
              <p>Loading teams...</p>
            ) : sdgTeams.length === 0 ? (
              <p>No teams registered yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Heads</th>
                      <th>Idea</th>
                      <th>Video Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sdgTeams.map(team => (
                      <React.Fragment key={team.id}>
                        <tr onClick={() => toggleExpandedRow(team.id)} style={{ cursor: 'pointer' }}>
                          <td>{team.name}</td>
                          <td>
                            {team.members?.find(m => m.uid === team.leader_uid)?.name || 'Leader'}
                          </td>
                          <td>{team.submission?.idea_title || '-'}</td>
                          <td>
                            {team.submission?.demo_video_link ? (
                              <a href={team.submission.demo_video_link} target="_blank" rel="noreferrer" style={{ color: colors.orange, textDecoration: 'underline' }} onClick={(e) => e.stopPropagation()}>
                                Watch Link
                              </a>
                            ) : '-'}
                          </td>
                          <td>
                            <button onClick={(e) => handleDeleteSdgTeam(team.id, e)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                        {expandedRow === team.id && (
                          <tr style={{ background: colors.paper }}>
                            <td colSpan="5">
                              <div style={{ padding: '12px' }}>
                                <strong>Members:</strong>
                                <ul>
                                  {team.members?.map((m, idx) => (
                                    <li key={idx}>{m.name} ({m.email}) {m.uid === team.leader_uid ? '[Leader]' : ''}</li>
                                  ))}
                                </ul>
                                <p style={{ marginTop: '8px', fontSize: '0.9rem', color: colors.muted }}>
                                  Track: {team.sdg_track} <br />
                                  Leader Phone: {team.leader_phone || 'N/A'} <br />
                                  Phase 1 Desc: {team.submission?.phase1_description || '-'}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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
                    <Input required value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} />
                  </FormGroup>
                  <FormGroup>
                    <label>Role</label>
                    <Input required value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })} placeholder="e.g. President, Core Member" />
                  </FormGroup>
                  <FormGroup>
                    <label>Description</label>
                    <TextArea value={memberForm.description} onChange={e => setMemberForm({ ...memberForm, description: e.target.value })} />
                  </FormGroup>
                  <FormGroup>
                    <label>Profile Picture</label>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
                      {memberForm.photo ? (
                        <img src={memberForm.photo} alt="Current" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', border: `4px solid ${colors.orange}`, boxShadow: `4px 4px 0 ${colors.ink}` }} />
                      ) : (
                        <div style={{ width: 120, height: 120, borderRadius: '50%', background: colors.paper, border: `2px dashed ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.muted }}>
                          No Photo
                        </div>
                      )}
                      
                      <div style={{ flex: 1 }}>
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          border: `2px dashed ${colors.orange}`,
                          borderRadius: '8px',
                          padding: '32px',
                          textAlign: 'center',
                          background: colors.paper,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={onSelectFile} 
                            style={{
                              opacity: 0,
                              position: 'absolute',
                              top: 0, left: 0, right: 0, bottom: 0,
                              width: '100%', height: '100%', cursor: 'pointer'
                            }} 
                          />
                          <div style={{ pointerEvents: 'none' }}>
                            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>📸</span>
                            <span style={{ fontWeight: 'bold', color: colors.ink, fontFamily: fonts.sans, fontSize: '1.1rem' }}>Click or Drag Image to Upload</span>
                          </div>
                        </div>
                        <Input
                          value={memberForm.photo}
                          onChange={e => setMemberForm({ ...memberForm, photo: e.target.value })}
                          placeholder="Or paste an image URL here..."
                          style={{ marginTop: 12 }}
                        />
                      </div>
                    </div>
                    
                    {imgSrc && (
                      <div style={{ marginTop: 24, background: '#fff', padding: 32, border: `2px solid ${colors.ink}`, borderRadius: '8px', boxShadow: `8px 8px 0 ${colors.sky}`, textAlign: 'center' }}>
                        <h3 style={{ marginTop: 0, fontFamily: fonts.display, color: colors.orange }}>Crop Image</h3>
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={1}
                          circularCrop
                        >
                          <img ref={imgRef} src={imgSrc} alt="Crop me" style={{ maxHeight: '400px', border: `1px solid ${colors.paper}` }} />
                        </ReactCrop>

                        <div style={{ marginTop: 24 }}>
                          <Button type="button" onClick={handleUploadCrop} disabled={!completedCrop || isUploading} style={{ width: '100%' }}>
                            {isUploading ? 'Uploading to Cloud...' : 'Upload & Save Crop'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <label>Instagram URL</label>
                    <Input value={memberForm.socials.instagram} onChange={e => setMemberForm({ ...memberForm, socials: { ...memberForm.socials, instagram: e.target.value } })} />
                  </FormGroup>
                  <FormGroup>
                    <label>LinkedIn URL</label>
                    <Input value={memberForm.socials.linkedin} onChange={e => setMemberForm({ ...memberForm, socials: { ...memberForm.socials, linkedin: e.target.value } })} />
                  </FormGroup>
                  <FormGroup>
                    <label>GitHub URL</label>
                    <Input value={memberForm.socials.github} onChange={e => setMemberForm({ ...memberForm, socials: { ...memberForm.socials, github: e.target.value } })} />
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
