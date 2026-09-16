import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { getDoc, doc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { colors, fonts } from 'styles/tokens';

const PageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.paper};
  background-image: 
    radial-gradient(${colors.ink} 1px, transparent 1px),
    radial-gradient(${colors.ink} 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const TitleCard = styled.div`
  background: ${colors.white};
  border: 4px solid ${colors.ink};
  box-shadow: 12px 12px 0 ${colors.ink};
  padding: 40px;
  text-align: center;
  margin-bottom: 60px;
  transform: rotate(-1deg);
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-size: 3rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: -1px;
`;

const CategorySection = styled.div`
  margin-bottom: 60px;
`;

const CategoryTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 2rem;
  background: ${colors.sky};
  display: inline-block;
  padding: 10px 20px;
  border: 3px solid ${colors.ink};
  box-shadow: 4px 4px 0 ${colors.ink};
  margin-bottom: 30px;
  text-transform: uppercase;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const PhotoCard = styled.div`
  background: ${colors.white};
  border: 3px solid ${colors.ink};
  padding: 12px;
  box-shadow: 8px 8px 0 ${colors.orange};
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 ${colors.orange};
  }

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border: 2px solid ${colors.ink};
    display: block;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(19, 17, 18, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  cursor: pointer;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  
  img {
    max-width: 100%;
    max-height: 90vh;
    border: 4px solid ${colors.white};
    box-shadow: 12px 12px 0 ${colors.ink};
    display: block;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -20px;
  right: -20px;
  background: ${colors.orange};
  color: ${colors.white};
  border: 2px solid ${colors.ink};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-family: ${fonts.mono};
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0 ${colors.ink};

  &:hover {
    background: ${colors.maroon};
  }
`;

export default function InaugurationGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'gallery', 'inauguration'));
        if (docSnap.exists()) {
          setImages(docSnap.data().images || []);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const getSortedByCategory = (cat) => {
    return images
      .filter(i => i.category === cat)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  };

  const groupImages = getSortedByCategory('group');
  const soloImages = getSortedByCategory('solo');
  const weirdImages = getSortedByCategory('weird');

  return (
    <PageRoot>
      <Head>
        <title>Inauguration Gallery | MXESA</title>
      </Head>
      <Header />
      
      <MainContent>
        <TitleCard>
          <Title>Inauguration Ceremony Gallery</Title>
          <p style={{ fontFamily: fonts.mono, fontSize: '1.2rem', marginTop: '16px' }}>
            A glimpse into the grand opening of MXESA.
          </p>
        </TitleCard>

        {loading ? (
          <p style={{ textAlign: 'center', fontFamily: fonts.mono, fontSize: '1.5rem', background: colors.white, padding: '20px', border: `2px solid ${colors.ink}` }}>Loading gallery...</p>
        ) : (
          <>
            {groupImages.length > 0 && (
              <CategorySection>
                <CategoryTitle>Group Photos</CategoryTitle>
                <GalleryGrid>
                  {groupImages.map((img, idx) => (
                    <PhotoCard key={idx} onClick={() => setSelectedImage(img.filename)}>
                      <img src={`/gallery/inauguration/${img.filename}`} alt="Group" loading="lazy" />
                    </PhotoCard>
                  ))}
                </GalleryGrid>
              </CategorySection>
            )}

            {soloImages.length > 0 && (
              <CategorySection>
                <CategoryTitle style={{ background: colors.orange }}>Solo Shots</CategoryTitle>
                <GalleryGrid>
                  {soloImages.map((img, idx) => (
                    <PhotoCard key={idx} onClick={() => setSelectedImage(img.filename)}>
                      <img src={`/gallery/inauguration/${img.filename}`} alt="Solo" loading="lazy" />
                    </PhotoCard>
                  ))}
                </GalleryGrid>
              </CategorySection>
            )}

            {weirdImages.length > 0 && (
              <CategorySection>
                <CategoryTitle style={{ background: colors.sky }}>Weird & Fun</CategoryTitle>
                <GalleryGrid>
                  {weirdImages.map((img, idx) => (
                    <PhotoCard key={idx} onClick={() => setSelectedImage(img.filename)}>
                      <img src={`/gallery/inauguration/${img.filename}`} alt="Weird" loading="lazy" />
                    </PhotoCard>
                  ))}
                </GalleryGrid>
              </CategorySection>
            )}
            
            {images.length === 0 && (
              <p style={{ textAlign: 'center', fontFamily: fonts.mono, fontSize: '1.5rem', background: colors.white, padding: '20px', border: `2px solid ${colors.ink}` }}>
                No images available yet. Check back later!
              </p>
            )}
          </>
        )}
      </MainContent>
      
      {selectedImage && (
        <ModalOverlay onClick={() => setSelectedImage(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedImage(null)}>✕</CloseButton>
            <img src={`/gallery/inauguration/${selectedImage}`} alt="Full size" />
          </ModalContent>
        </ModalOverlay>
      )}

      <Footer />
    </PageRoot>
  );
}
