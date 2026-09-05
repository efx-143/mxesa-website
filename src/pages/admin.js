import { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from 'components/Header';
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

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_SDG_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'mxesa_admin_authorized') {
      setIsLoggedIn(true);
      fetchTeams(token);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'mxesa_admin' && password === 'mmit@134') {
      localStorage.setItem('admin_token', 'mxesa_admin_authorized');
      setIsLoggedIn(true);
      setError('');
      fetchTeams('mxesa_admin_authorized');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setTeams([]);
  };

  const fetchTeams = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sdg/admin/teams`, {
        headers: {
          'Authorization': `Admin ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
      } else {
        console.error('Failed to fetch teams');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title>Admin Dashboard</Title>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        
        <Card>
          <h2>SDG Ideathon Teams</h2>
          {loading ? (
            <p>Loading teams...</p>
          ) : teams.length === 0 ? (
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
                  {teams.map(team => (
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
      </MainContent>
    </PageRoot>
  );
}
