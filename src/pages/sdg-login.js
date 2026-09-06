import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  signInWithGoogle,
  onAuthStateChange,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
} from 'lib/firebase';
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
  position: relative;
  z-index: 1;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${colors.white};
  border: 2px solid ${colors.ink};
  box-shadow: 8px 8px 0 ${colors.sky};
  padding: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-size: 2.5rem;
  margin: 0 0 16px;

  em {
    color: ${colors.orange};
    font-style: normal;
  }
`;

const Description = styled.p`
  color: ${colors.muted};
  margin: 0 0 24px;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  padding: 14px;
  font-family: ${fonts.mono};
  font-size: 1rem;
  border: 2px solid ${colors.ink};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.orange};
  }
`;

const ErrorMessage = styled.p`
  color: ${colors.maroon};
  background: #ffdbdb;
  padding: 12px;
  border: 2px solid ${colors.maroon};
  font-family: ${fonts.mono};
  font-size: 0.9rem;
  margin-bottom: 16px;
  text-align: left;
`;

const SuccessMessage = styled.p`
  color: #155724;
  background: #d4edda;
  padding: 12px;
  border: 2px solid #c3e6cb;
  font-family: ${fonts.mono};
  font-size: 0.9rem;
  margin-bottom: 16px;
  text-align: left;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 16px 24px;
  background: ${(props) => (props.$primary ? colors.orange : colors.white)};
  border: 2px solid ${colors.ink};
  box-shadow: 4px 4px 0
    ${(props) => (props.$primary ? colors.maroon : colors.ink)};
  font-family: ${fonts.mono};
  font-weight: 700;
  font-size: 1rem;
  color: ${(props) => (props.$primary ? colors.white : colors.ink)};
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0
      ${(props) => (props.$primary ? colors.maroon : colors.ink)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: ${colors.muted};
  font-size: 0.9rem;
  font-family: ${fonts.mono};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 2px solid ${colors.muted};
    opacity: 0.3;
  }

  &::before {
    margin-right: 0.5em;
  }

  &::after {
    margin-left: 0.5em;
  }
`;

const ToggleLink = styled.p`
  margin-top: 16px;
  font-size: 0.9rem;
  color: ${colors.muted};

  a {
    color: ${colors.orange};
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`;

export default function SdgLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // Automatically redirect if already logged in
        router.push('/sdg-dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setFormError('');
    setFormMessage('');
    try {
      await signInWithGoogle();
      // the onAuthStateChange should trigger redirect
    } catch (error) {
      if (
        error.code !== 'auth/popup-closed-by-user' &&
        error.code !== 'auth/cancelled-popup-request'
      ) {
        setFormError(
          'Failed to log in with Google: ' + (error.message || 'Unknown error'),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setFormError('');
    setFormMessage('');
    if (!email) {
      setFormError('Please enter your email address to reset password.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setFormMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      let errorMsg = error.message || 'Unknown error';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        errorMsg = 'No account found with this email.';
      }
      setFormError('Failed to send reset email: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormMessage('');
    if (!email || !password) {
      setFormError('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      router.push('/sdg-dashboard');
    } catch (error) {
      let errorMsg = error.message || 'Unknown error';
      if (error.code === 'auth/email-already-in-use') {
         errorMsg = 'This email is already registered. Try logging in instead.';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
         errorMsg = 'Invalid email or password.';
      } else if (error.code === 'auth/weak-password') {
         errorMsg = 'Password is too weak. Please use at least 6 characters.';
      }
      setFormError('Authentication failed: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageRoot>
      <Head>
        <title>{isSignUp ? 'Sign Up' : 'Login'} | SDG Ideathon</title>
      </Head>
      <Header standalone />
      <MainContent>
        <LoginCard>
          <Title>
            SDG <em>Ideathon</em>
          </Title>
          <Description>
            Sign in to create a team or view your dashboard.
          </Description>

          {formError && <ErrorMessage>{formError}</ErrorMessage>}
          {formMessage && <SuccessMessage>{formMessage}</SuccessMessage>}

          <Form onSubmit={handleEmailAuth}>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Button type="submit" $primary disabled={loading}>
              {loading
                ? isSignUp
                  ? 'Signing up...'
                  : 'Signing in...'
                : isSignUp
                  ? 'Sign Up'
                  : 'Sign In'}
            </Button>
            
            {!isSignUp && (
              <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}
                  style={{ color: colors.muted, fontSize: '0.85rem', textDecoration: 'underline' }}
                >
                  Forgot password?
                </a>
              </div>
            )}
          </Form>

          <ToggleLink>
            {isSignUp ? 'Already have an account? ' : 'Don’t have an account? '}
            <a onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign in instead' : 'Sign up now'}
            </a>
          </ToggleLink>

          <Divider>OR</Divider>

          <Button type="button" onClick={handleGoogleLogin} disabled={loading}>
            {loading ? 'Please wait...' : 'Continue with Google'}
          </Button>
        </LoginCard>
      </MainContent>
    </PageRoot>
  );
}
