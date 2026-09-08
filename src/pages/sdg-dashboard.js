import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { onAuthStateChange, signOutUser } from 'lib/firebase';
import Header from 'components/Header';
import { colors, fonts, breakpoints } from 'styles/tokens';

const PageRoot = styled.div`
  min-height: 100vh;
  background: ${colors.paper};
`;

const MainContent = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-size: 2.5rem;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  color: ${colors.muted};
  font-size: 1.1rem;
  margin: 0 0 32px;
`;

const Card = styled.div`
  background: ${colors.white};
  border: 2px solid ${colors.ink};
  box-shadow: 6px 6px 0 ${colors.sky};
  padding: 32px;
  margin-bottom: 32px;
`;

const CardTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 1.5rem;
  margin: 0 0 20px;
  border-bottom: 2px solid ${colors.inkSoft};
  padding-bottom: 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 700;
    margin-bottom: 8px;
    font-size: 0.95rem;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid ${colors.ink};
    font-family: ${fonts.sans};
    font-size: 1rem;
    background: ${colors.paper};
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${colors.orange};
  color: ${colors.white};
  border: 2px solid ${colors.ink};
  font-family: ${fonts.mono};
  font-weight: 700;
  cursor: pointer;
  box-shadow: 4px 4px 0 ${colors.maroon};
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 ${colors.maroon};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const ErrorText = styled.p`
  color: ${colors.pink};
  font-weight: 700;
`;

const SDGs = [
  '1: No Poverty',
  '2: Zero Hunger',
  '3: Good Health and Well-being',
  '4: Quality Education',
  '5: Gender Equality',
  '6: Clean Water and Sanitation',
  '7: Affordable and Clean Energy',
  '8: Decent Work and Economic Growth',
  '9: Industry, Innovation and Infrastructure',
  '10: Reduced Inequality',
  '11: Sustainable Cities and Communities',
  '12: Responsible Consumption and Production',
  '13: Climate Action',
  '14: Life Below Water',
  '15: Life on Land',
  '16: Peace and Justice Strong Institutions',
  '17: Partnerships to achieve the Goal',
];

export default function SdgDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [sdgTrack, setSdgTrack] = useState(SDGs[0]);
  const [addMemberName, setAddMemberName] = useState('');
  const [addMemberEmail, setAddMemberEmail] = useState('');

  // Submission states
  const [ideaTitle, setIdeaTitle] = useState('');
  const [phase1Description, setPhase1Description] = useState('');
  const [demoVideoLink, setDemoVideoLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_SDG_API_BASE_URL || '';

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/sdg-login');
        return;
      }
      setUser(firebaseUser);
      await fetchTeamData(firebaseUser);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchTeamData = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/sdg/teams/my_team`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        setTeam(null);
      } else if (res.ok) {
        const data = await res.json();
        setTeam(data.team);
        if (data.team.submission) {
          setIdeaTitle(data.team.submission.idea_title || '');
          setPhase1Description(data.team.submission.phase1_description || '');
          setDemoVideoLink(data.team.submission.demo_video_link || '');
        }
      } else {
        console.error('Failed to fetch team data');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/api/sdg/teams`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_name: teamName,
          sdg_track: sdgTrack,
        }),
      });

      if (res.ok) {
        await fetchTeamData(user);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create team');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!addMemberName || !addMemberEmail) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/api/sdg/teams/${team.id}/add_member`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: addMemberName, email: addMemberEmail }),
      });

      if (res.ok) {
        alert('Member added successfully!');
        setAddMemberName('');
        setAddMemberEmail('');
        await fetchTeamData(user);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add member');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${API_BASE}/api/sdg/teams/${team.id}/submission`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idea_title: ideaTitle,
            phase1_description: phase1Description,
            demo_video_link: demoVideoLink,
          }),
        },
      );

      if (res.ok) {
        alert('Submission saved successfully!');
        await fetchTeamData(user);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save submission');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageRoot>
        <Header standalone />
        <MainContent>Loading...</MainContent>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <Head>
        <title>Dashboard | SDG Ideathon</title>
      </Head>
      <Header standalone />
      <MainContent>
        <HeaderRow>
          <div>
            <Title>Team Dashboard</Title>
            <Subtitle>Welcome, {user?.displayName || user?.email}</Subtitle>
          </div>
          <Button
            onClick={() => {
              signOutUser();
              router.push('/sdg-login');
            }}
            style={{ background: colors.paper, color: colors.ink }}
          >
            Log Out
          </Button>
        </HeaderRow>

        {!team ? (
          <Card>
            <CardTitle>Create a Team</CardTitle>
            <form onSubmit={handleCreateTeam}>
              <FormGroup>
                <label>Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  placeholder="E.g. The Innovators"
                />
              </FormGroup>
              <FormGroup>
                <label>SDG Track</label>
                <select
                  value={sdgTrack}
                  onChange={(e) => setSdgTrack(e.target.value)}
                  required
                >
                  {SDGs.map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <Button type="submit">Create Team</Button>
            </form>
          </Card>
        ) : (
          <>
            <Card>
              <CardTitle>{team.name}</CardTitle>
              <p>
                <strong>Track:</strong> {team.sdg_track}
              </p>

              <h3 style={{ marginTop: '24px', fontFamily: fonts.display }}>
                Members
              </h3>
              <ul>
                {team.members.map((m) => (
                  <li key={m.email}>
                    {m.name} ({m.email}){' '}
                    {m.uid === team.leader_uid && <strong>[Leader]</strong>}
                  </li>
                ))}
              </ul>

              {user.uid === team.leader_uid && (
                <div style={{ marginTop: '24px' }}>
                  <h3
                    style={{ fontFamily: fonts.display, marginBottom: '12px' }}
                  >
                    Add Members
                  </h3>
                  {team.members.length >= 4 ? (
                    <p style={{ color: colors.muted }}>Your team is full (4 members max).</p>
                  ) : (
                    <form onSubmit={handleAddMember}>
                      <ActionRow style={{ marginBottom: '12px' }}>
                        <input
                          type="text"
                          value={addMemberName}
                          onChange={(e) => setAddMemberName(e.target.value)}
                          placeholder="Member's name"
                          required
                          style={{
                            padding: '12px',
                            border: `2px solid ${colors.ink}`,
                            flex: 1,
                          }}
                        />
                        <input
                          type="email"
                          value={addMemberEmail}
                          onChange={(e) => setAddMemberEmail(e.target.value)}
                          placeholder="Member's email"
                          required
                          style={{
                            padding: '12px',
                            border: `2px solid ${colors.ink}`,
                            flex: 1,
                          }}
                        />
                      </ActionRow>
                      <Button type="submit">Add Member</Button>
                    </form>
                  )}
                </div>
              )}
            </Card>

            <Card>
              <CardTitle>Phase 1 Submission</CardTitle>
              {team.submission?.idea_title ? (
                <div style={{ background: '#d4edda', padding: '16px', border: '2px solid #c3e6cb', marginBottom: '20px', color: '#155724' }}>
                  <strong>✅ Submission Received!</strong> Your idea has been successfully submitted and is locked for review.
                </div>
              ) : null}

              {user.uid === team.leader_uid && !team.submission?.idea_title ? (
                <form onSubmit={handleSubmission}>
                  <FormGroup>
                    <label>Idea Title</label>
                    <input
                      type="text"
                      value={ideaTitle}
                      onChange={(e) => setIdeaTitle(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Description</label>
                    <textarea
                      value={phase1Description}
                      onChange={(e) => setPhase1Description(e.target.value)}
                      required
                      placeholder="Explain the problem and your proposed solution..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Demo Video Link (YouTube/Drive)</label>
                    <input
                      type="url"
                      value={demoVideoLink}
                      onChange={(e) => setDemoVideoLink(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Submission'}
                  </Button>
                </form>
              ) : (
                <div>
                  <p>
                    <strong>Idea Title:</strong>{' '}
                    {team.submission?.idea_title || 'Not provided yet'}
                  </p>
                  <p>
                    <strong>Description:</strong>{' '}
                    {team.submission?.phase1_description || 'Not provided yet'}
                  </p>
                  <p>
                    <strong>Video Link:</strong>{' '}
                    {team.submission?.demo_video_link ? (
                      <a
                        href={team.submission.demo_video_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Video
                      </a>
                    ) : (
                      'Not provided yet'
                    )}
                  </p>
                  <p style={{ marginTop: '20px', color: colors.muted }}>
                    {team.submission?.idea_title 
                      ? 'This submission is locked and cannot be edited.' 
                      : 'Only the team leader can edit the submission.'}
                  </p>
                </div>
              )}
            </Card>
          </>
        )}
      </MainContent>
    </PageRoot>
  );
}
