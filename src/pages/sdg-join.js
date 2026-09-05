import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { onAuthStateChange, signInWithGoogle } from 'lib/firebase';
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${colors.white};
  border: 2px solid ${colors.ink};
  box-shadow: 8px 8px 0 ${colors.sky};
  padding: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-size: 2rem;
  margin: 0 0 16px;
`;

const Text = styled.p`
  color: ${colors.muted};
  margin: 0 0 30px;
  font-size: 1.1rem;
`;

const Button = styled.button`
  display: inline-block;
  padding: 14px 28px;
  background: ${colors.orange};
  color: ${colors.white};
  border: 2px solid ${colors.ink};
  font-family: ${fonts.mono};
  font-weight: 700;
  font-size: 1rem;
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

export default function SdgJoin() {
  const router = useRouter();
  const { token } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Checking auth...');

  const API_BASE =
    process.env.NEXT_PUBLIC_SDG_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setStatus('Invalid or missing invitation token.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setStatus('Joining team...');
        await joinTeam(firebaseUser, token);
      } else {
        setStatus('Please log in with Google to accept the invitation.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router.isReady, token]);

  const joinTeam = async (firebaseUser, inviteToken) => {
    try {
      const authToken = await firebaseUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/sdg/teams/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: inviteToken }),
      });

      if (res.ok) {
        setStatus('Successfully joined the team! Redirecting...');
        setTimeout(() => {
          router.push('/sdg-dashboard');
        }, 1500);
      } else {
        const err = await res.json();
        setStatus(
          err.error || 'Failed to join the team. The link may be expired.',
        );
        setLoading(false);
      }
    } catch (err) {
      setStatus('Network error. Please try again later.');
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      // After login, the onAuthStateChange will catch it and call joinTeam automatically
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <PageRoot>
      <Head>
        <title>Join Team | SDG Ideathon</title>
      </Head>
      <Header standalone />
      <MainContent>
        <Card>
          <Title>Join SDG Ideathon Team</Title>
          <Text>{status}</Text>

          {!user &&
            !loading &&
            status !== 'Invalid or missing invitation token.' && (
              <Button onClick={handleLogin}>Sign in with Google to Join</Button>
            )}

          {user && !loading && (
            <Button onClick={() => router.push('/sdg-dashboard')}>
              Go to Dashboard
            </Button>
          )}
        </Card>
      </MainContent>
    </PageRoot>
  );
}
