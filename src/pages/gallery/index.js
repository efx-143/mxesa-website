import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { breakpoints, colors, fonts } from 'styles/tokens';

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

const MainContent = styled.main`
  padding: clamp(40px, 5vw, 80px) 20px;
  max-width: 1280px;
  margin: 0 auto;
`;

const GalleryGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const GalleryCard = styled.div`
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  padding: 24px;
  box-shadow: 6px 6px 0 ${colors.sky};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 ${colors.maroon};
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 12px;
  font-family: ${fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
`;

const CardDescription = styled.p`
  margin: 0 0 24px;
  flex-grow: 1;
`;

const CardLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: ${colors.orange};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  border: 2px solid ${colors.ink};
  align-self: flex-start;
  transition: background 0.2s;

  &:hover {
    background: ${colors.maroon};
  }
`;

export default function GalleryHub() {
  return (
    <PageRoot>
      <Head>
        <title>Gallery | MXESA 2026-27</title>
        <meta name="description" content="View the memories and past events of MXESA." />
      </Head>

      <Header standalone />

      <PageHero>
        <Eyebrow>Memories</Eyebrow>
        <PageTitle>
          <span>MXESA</span>
          <em>Gallery</em>
        </PageTitle>
      </PageHero>

      <MainContent>
        <GalleryGrid>
          <GalleryCard>
            <CardTitle>Inauguration Ceremony</CardTitle>
            <CardDescription>
              September 7, 2026. The official launch of the Mechatronics Engineering Student's Association.
            </CardDescription>
            <CardLink href="/gallery/inauguration">View Album</CardLink>
          </GalleryCard>
          {/* Add more albums here in the future */}
        </GalleryGrid>
      </MainContent>

      <Footer />
    </PageRoot>
  );
}
