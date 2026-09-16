import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import Header from 'components/Header';
import { breakpoints, colors, fonts } from 'styles/tokens';

const SDGs = [
  { id: 1, title: 'No Poverty', color: '#E5243B', icon: '💰' },
  { id: 2, title: 'Zero Hunger', color: '#DDA63A', icon: '🍽️' },
  { id: 3, title: 'Good Health and Well-being', color: '#4C9F38', icon: '⚕️' },
  { id: 4, title: 'Quality Education', color: '#C5192D', icon: '📚' },
  { id: 5, title: 'Gender Equality', color: '#FF3A21', icon: '⚖️' },
  { id: 6, title: 'Clean Water and Sanitation', color: '#26BDE2', icon: '🚰' },
  { id: 7, title: 'Affordable and Clean Energy', color: '#FCC30B', icon: '⚡' },
  {
    id: 8,
    title: 'Decent Work and Economic Growth',
    color: '#A21942',
    icon: '📈',
  },
  {
    id: 9,
    title: 'Industry, Innovation and Infrastructure',
    color: '#FD6925',
    icon: '🏭',
  },
  { id: 10, title: 'Reduced Inequality', color: '#DD1367', icon: '🤝' },
  {
    id: 11,
    title: 'Sustainable Cities and Communities',
    color: '#FD9D24',
    icon: '🏙️',
  },
  {
    id: 12,
    title: 'Responsible Consumption and Production',
    color: '#BF8B2E',
    icon: '♻️',
  },
  { id: 13, title: 'Climate Action', color: '#3F7E44', icon: '🌍' },
  { id: 14, title: 'Life Below Water', color: '#0A97D9', icon: '🐟' },
  { id: 15, title: 'Life on Land', color: '#56C02B', icon: '🌳' },
  {
    id: 16,
    title: 'Peace and Justice Strong Institutions',
    color: '#00689D',
    icon: '🕊️',
  },
  {
    id: 17,
    title: 'Partnerships to achieve the Goal',
    color: '#19486A',
    icon: '🔗',
  },
];

const PageRoot = styled.div`
  min-height: 100vh;
  background: ${colors.paper};
`;

const PageHero = styled.section`
  padding: clamp(60px, 8vw, 120px) 20px clamp(40px, 5vw, 80px);
  background: ${colors.forest};
  color: ${colors.white};
  text-align: center;
  border-bottom: 2px solid ${colors.ink};
`;

const Eyebrow = styled.p`
  margin: 0 0 14px;
  color: ${colors.sky};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;

  em {
    display: block;
    color: ${colors.orange};
    font-style: normal;
  }
`;

const PageSubtitle = styled.p`
  max-width: 52ch;
  margin: 20px auto 0;
  color: ${colors.white};
  font-size: 1.1rem;
  opacity: 0.85;
`;

const Section = styled.section`
  padding: clamp(60px, 7vw, 100px) 20px;
  border-bottom: 2px solid ${colors.ink};
  background: ${(props) => (props.$alt ? colors.paperDeep : colors.paper)};
`;

const SectionInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  margin: 0 0 48px;
  font-family: ${fonts.display};
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;
`;

const SdgGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const SdgCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 5px 5px 0 ${(props) => props.$color || colors.ink};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 ${(props) => props.$color || colors.ink};
  }
`;

const SdgIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
`;

const SdgNumber = styled.span`
  font-family: ${fonts.mono};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.$color || colors.muted};
  margin-bottom: 4px;
`;

const SdgTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.1;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 40px;
  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoBox = styled.div`
  padding: 32px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 6px 6px 0 ${colors.sky};

  h3 {
    margin: 0 0 16px;
    font-family: ${fonts.display};
    font-size: 1.8rem;
    font-weight: 800;
  }

  p,
  ul {
    margin: 0 0 16px;
    font-size: 1.05rem;
  }

  ul {
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;

const CtaWrapper = styled.div`
  text-align: center;
  margin-top: 60px;
`;

const CtaButton = styled(Link)`
  display: inline-block;
  padding: 16px 40px;
  border: 2px solid ${colors.ink};
  background: ${colors.orange};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-decoration: none;
  box-shadow: 6px 6px 0 ${colors.maroon};
  text-transform: uppercase;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 ${colors.maroon};
  }
`;

export default function SdgIdeathon() {
  return (
    <PageRoot>
      <Head>
        <title>SDG Ideathon | MXESA 2026-27</title>
        <meta
          name="description"
          content="Join the SDG Ideathon at MMIT Pune. Form your team, lock a problem statement, and build solutions."
        />
      </Head>

      <Header standalone />

      <main id="main">
        <PageHero>
          <Eyebrow>September 2026</Eyebrow>
          <PageTitle>
            <span>SDG</span>
            <em>Ideathon</em>
          </PageTitle>
          <PageSubtitle>
            17 Global Goals. 1 Massive Opportunity. Form your team, pick a
            track, and submit your Phase 1 idea.
          </PageSubtitle>
          <CtaWrapper style={{ marginTop: '30px' }}>
            <CtaButton href="/sdg-login">Register / Apply</CtaButton>
          </CtaWrapper>
        </PageHero>

        <Section $alt>
          <SectionInner>
            <InfoGrid>
              <InfoBox>
                <h3>Important Dates</h3>
                <ul>
                  <li>
                    <strong>Registration Opens:</strong> September 8, 2026
                  </li>
                  <li>
                    <strong>Phase 1 Submission Deadline:</strong> September 11,
                    2026 (11:59 PM IST)
                  </li>
                  <li>
                    <strong>Top 10 Team Presentation:</strong> September 15, 2026
                  </li>
                </ul>
              </InfoBox>
              <InfoBox>
                <h3>Evaluation & Rules</h3>
                <ul>
                  <li>
                    <strong>Team Size:</strong> 1 to 4 members per team.
                  </li>
                  <li>
                    <strong>Eligibility:</strong> Open to all students.
                  </li>
                  <li>
                    <strong>Phase 1:</strong> Phase 1 submission includes Team Creation and Video Submission as per rules till 11th September.
                  </li>
                  <li>
                    <strong>Phase 2 (Top 10):</strong> The best 10 ideas proceed to the presentation phase.
                  </li>
                  <li>
                    <strong>Winners:</strong> Top 3 teams will receive special recognition and prizes and remaining will get certificates.
                  </li>
                </ul>
              </InfoBox>
            </InfoGrid>
          </SectionInner>
        </Section>

        <Section>
          <SectionInner>
            <SectionTitle>
              The 17 <em>Tracks.</em>
            </SectionTitle>
            <SdgGrid>
              {SDGs.map((sdg) => (
                <SdgCard key={sdg.id} $color={sdg.color}>
                  <SdgIcon>{sdg.icon}</SdgIcon>
                  <SdgNumber $color={sdg.color}>Goal {sdg.id}</SdgNumber>
                  <SdgTitle>{sdg.title}</SdgTitle>
                </SdgCard>
              ))}
            </SdgGrid>
            <CtaWrapper>
              <CtaButton href="/sdg-login">Ready? Lock your track.</CtaButton>
            </CtaWrapper>
          </SectionInner>
        </Section>
      </main>
    </PageRoot>
  );
}
