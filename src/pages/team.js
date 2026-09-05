import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';

import Header from 'components/Header';
import { breakpoints, colors, fonts } from 'styles/tokens';

// --- Icons ---
const GithubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const UserPlaceholderIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FlipIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

// --- Committee Data: Head + Members per designation ---
const COMMITTEE = [
  {
    id: 'president',
    role: 'President',
    featured: true,
    head: {
      name: 'Mr. Sanyam Chavan',
      description: 'Leading the association with a vision for innovation.',
      photo: '/sanyam1.png',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [],
  },
  {
    id: 'vice-president',
    role: 'Vice President',
    featured: true,
    head: {
      name: 'Mr. Shivam Mohite',
      description: 'Assisting the president and managing core operations.',
      photo: '/shivam.jpeg',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [],
  },
  {
    id: 'ladies-secretary',
    role: 'Ladies Secretary',
    featured: true,
    head: {
      name: 'Ms. Janhavi Patil',
      description:
        'Representing and empowering female students in the association.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [],
  },
  {
    id: 'treasurer',
    role: 'Treasurer',
    featured: true,
    head: {
      name: 'Mr. Chitranjan Bhalerao',
      description: 'Managing the finances and budget for all events.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [],
  },
  {
    id: 'technical',
    role: 'Technical Committee',
    featured: false,
    head: {
      name: 'Mr. Yash Chavan',
      description: 'Leading technical events, workshops, and hackathons.',
      photo: '/yash.png',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Mr. Aryan Hatgale', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Mr. Prasad Patankar', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Mr. Himanshu Bendale', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Mr. Atharva Inamdar', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Kunika Daiwalkar', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'newsletter',
    role: 'Newsletter & Magazine',
    featured: false,
    head: {
      name: 'Mr. Shreyash Ugile',
      description: 'Curating content for the MXESA magazine and newsletters.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Mr. Sarthak Hase', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Pratiksha Hatte', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Gayatri Khandagale', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Bhagyshree Jadhav', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'tnp',
    role: 'T&P Coordinator',
    featured: false,
    head: {
      name: 'Mr. Yojit Giri',
      description:
        'Facilitating training, placements, and alumni interactions.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Mr. Parth Konde', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'industry-connect',
    role: 'Industry Connect',
    featured: false,
    head: {
      name: 'Mr. Kaustubh Walunj',
      description: 'Bridging the gap between students and the industry.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Ms. Komal Pawar', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'website',
    role: 'Website Committee',
    featured: false,
    head: {
      name: 'Mr. Shubhankar Tumne',
      description: 'Managing the digital presence and official website.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Mr. Mrunal Rinit', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Mr. Sanskar Khedkar', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Mr. Anis Mulani', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'social-media',
    role: 'Social Media',
    featured: false,
    head: {
      name: 'Mr. Aditya Waghmare',
      description: 'Managing official social media channels and outreach.',
      photo: '/aditya.png',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Mr. Ishwar Gaikwad', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Shweta Shirture', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'cultural',
    role: 'Cultural Committee',
    featured: false,
    head: {
      name: 'Mr. Vedant Jadhav',
      description: 'Organizing engaging cultural events and activities.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Mr. Aditya Thombare', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Soham Gore', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Sampriti Palande', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Tina Waghode', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Kalyani Shirsat', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Ms. Trupti Gawande', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'sports',
    role: 'Sports Committee',
    featured: false,
    head: {
      name: 'Mr. Rishikesh Nikam',
      description: 'Managing and promoting sports events for the association.',
      photo: '/rushi.jpeg',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [
      { name: 'Mr. Rajwardhan Bhosale', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Mr. Sairaj Abnave', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
      { name: 'Mr. Aryan Hanbar', photo: '', socials: { instagram: '#', linkedin: '#', github: '#' } },
    ],
  },
  {
    id: 'library',
    role: 'Library Coordinator',
    featured: false,
    head: {
      name: 'Mr. Ganesh Kottawar',
      description: 'Maintaining the departmental library and resources.',
      photo: '',
      socials: { instagram: '#', linkedin: '#', github: '#' },
    },
    members: [],
  },
];

// Faculty advisors
const FACULTY = [
  { id: 'faculty-1', role: 'Faculty Coordinator', name: 'Prof. Shital Khande' },
  { id: 'faculty-2', role: 'Faculty Coordinator', name: 'Dr. Yogini Borole' },
];

// --- Styled Components ---
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
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 400;
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
    color: ${colors.sky};
    font-style: normal;
  }
`;

const PageSubtitle = styled.p`
  max-width: 52ch;
  margin: 20px auto 0;
  color: ${colors.white};
  font-size: 1rem;
  opacity: 0.85;
`;

// --- Faculty Section ---
const FacultySection = styled.section`
  padding: clamp(60px, 7vw, 100px) 20px;
  background: ${colors.paperDeep};
  border-bottom: 2px solid ${colors.ink};
`;

const SectionInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SectionLabel = styled.p`
  margin: 0 0 8px;
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.muted};
`;

const SectionTitle = styled.h2`
  margin: 0 0 48px;
  font-family: ${fonts.display};
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;

  em {
    color: ${colors.orange};
    font-style: normal;
  }
`;

const FacultyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FacultyCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 6px 6px 0 ${colors.sky};
`;

const FacultyAvatar = styled.div`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${colors.forest};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-family: ${fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
`;

const FacultyInfo = styled.div``;

const FacultyRole = styled.span`
  display: block;
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.muted};
  margin-bottom: 4px;
`;

const FacultyName = styled.strong`
  display: block;
  font-family: ${fonts.display};
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

// --- Members Section ---
const MembersSection = styled.section`
  padding: clamp(60px, 7vw, 100px) 20px;
  border-bottom: 2px solid ${colors.ink};
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// --- Flip Card Styles ---
const FlipCardWrapper = styled.div`
  perspective: 1200px;
  position: relative;
`;

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  transform: ${({ $flipped }) => ($flipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

// Front face: normal flow — grows to fit content
const CardFaceFront = styled.div`
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid ${colors.ink};
  overflow: hidden;
`;

// Back face: absolute overlay that matches the front's height perfectly
const CardFaceBack = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid ${colors.ink};
  overflow: hidden;
  transform: rotateY(180deg);
`;

const CardFront = styled(CardFaceFront)`
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
  cursor: pointer;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 9px 9px 0 ${colors.maroon};
  }
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
`;

const CardBack = styled(CardFaceBack)`
  background: ${colors.forest};
  color: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.ink};
  cursor: pointer;
`;

const MemberPhotoContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: ${colors.paperDeep};
  border-bottom: 2px solid ${colors.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  svg {
    width: 30%;
    height: 30%;
    color: ${colors.muted};
    opacity: 0.5;
  }
`;

const MemberContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const MemberTag = styled.span`
  align-self: flex-start;
  padding: 5px 10px;
  color: ${colors.white};
  background: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const MemberName = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

const MemberDescription = styled.p`
  margin: 12px 0 0;
  font-size: 0.95rem;
  color: ${colors.inkSoft};
  line-height: 1.5;
  flex-grow: 1;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  color: ${({ $light }) => ($light ? colors.white : colors.ink)};
  opacity: 0.6;
  transition:
    opacity 0.15s ease,
    color 0.15s ease;

  &:hover {
    opacity: 1;
    color: ${colors.orange};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 3px 8px;
  background: ${colors.orange};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  z-index: 2;
  border: 1px solid ${colors.ink};
`;

const FlipHint = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 16px;
  color: ${colors.muted};
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  svg {
    width: 14px;
    height: 14px;
  }
`;

// --- Back Card Styles ---
const BackHeader = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
`;

const BackRoleTag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: ${colors.orange};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const BackTitle = styled.h4`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const BackMembersList = styled.div`
  padding: 16px 24px;
  overflow-y: auto;
  flex-grow: 1;
`;

const BackMemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const BackMemberAvatar = styled.div`
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-family: ${fonts.display};
  font-size: 0.9rem;
  font-weight: 800;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const BackMemberInfo = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

const BackMemberName = styled.span`
  display: block;
  font-family: ${fonts.display};
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const BackMemberSocials = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const BackFlipHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.5);
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  svg {
    width: 14px;
    height: 14px;
  }
`;

// --- One Man Army back for solo members ---
const OneManArmyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding: 40px 24px;
  text-align: center;
`;

const OneManArmyEmoji = styled.span`
  font-size: 4rem;
  line-height: 1;
  margin-bottom: 20px;
`;

const OneManArmyTitle = styled.h4`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${colors.white};
`;

const OneManArmySubtitle = styled.p`
  margin: 12px 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: ${fonts.sans};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 40px;
  color: ${colors.muted};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    color: ${colors.ink};
  }
`;

const getInitials = (name) => {
  if (!name || name === 'TBD') return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

// --- Flip Card Component ---
const FlipCard = ({ committee }) => {
  const [flipped, setFlipped] = useState(false);
  const { role, featured, head, members } = committee;
  const hasMembers = members.length > 0;

  const handleFlip = (e) => {
    // Prevent flip when clicking social links
    if (e.target.closest('a')) return;
    setFlipped((f) => !f);
  };

  return (
    <FlipCardWrapper>
      <FlipCardInner $flipped={flipped}>
        {/* --- FRONT: Head --- */}
        <CardFront onClick={handleFlip}>
          <MemberPhotoContainer>
            {featured && <FeaturedBadge>Core</FeaturedBadge>}
            {head.photo ? (
              <img src={head.photo} alt={head.name} />
            ) : (
              <UserPlaceholderIcon />
            )}
          </MemberPhotoContainer>
          <MemberContent>
            <MemberTag>{role}</MemberTag>
            <MemberName>{head.name}</MemberName>
            {head.description && (
              <MemberDescription>{head.description}</MemberDescription>
            )}
            {head.socials && (
              <SocialLinks>
                {head.socials.instagram && (
                  <SocialLink
                    href={head.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </SocialLink>
                )}
                {head.socials.linkedin && (
                  <SocialLink
                    href={head.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon />
                  </SocialLink>
                )}
                {head.socials.github && (
                  <SocialLink
                    href={head.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <GithubIcon />
                  </SocialLink>
                )}
              </SocialLinks>
            )}
            <FlipHint>
              <FlipIcon />
              {hasMembers
                ? `Click to see ${members.length} team member${members.length > 1 ? 's' : ''}`
                : 'Click to flip'}
            </FlipHint>
          </MemberContent>
        </CardFront>

        {/* --- BACK --- */}
        <CardBack onClick={handleFlip}>
          <BackHeader>
            <BackRoleTag>
              {role}
              {hasMembers ? ' — Team' : ''}
            </BackRoleTag>
            <BackTitle>
              {hasMembers ? `Head: ${head.name}` : head.name}
            </BackTitle>
          </BackHeader>

          {hasMembers ? (
            /* Team members list */
            <BackMembersList>
              {members.map((m) => (
                <BackMemberItem key={m.name}>
                  <BackMemberAvatar>
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} />
                    ) : (
                      getInitials(m.name)
                    )}
                  </BackMemberAvatar>
                  <BackMemberInfo>
                    <BackMemberName>{m.name}</BackMemberName>
                    {m.socials && (
                      <BackMemberSocials>
                        {m.socials.instagram && (
                          <SocialLink
                            $light
                            href={m.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                          >
                            <InstagramIcon />
                          </SocialLink>
                        )}
                        {m.socials.linkedin && (
                          <SocialLink
                            $light
                            href={m.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                          >
                            <LinkedinIcon />
                          </SocialLink>
                        )}
                        {m.socials.github && (
                          <SocialLink
                            $light
                            href={m.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                          >
                            <GithubIcon />
                          </SocialLink>
                        )}
                      </BackMemberSocials>
                    )}
                  </BackMemberInfo>
                </BackMemberItem>
              ))}
            </BackMembersList>
          ) : (
            /* One Man Army - solo member */
            <OneManArmyContainer>
              <OneManArmyEmoji>🔥</OneManArmyEmoji>
              <OneManArmyTitle>One Man Army</OneManArmyTitle>
              <OneManArmySubtitle>
                {head.name} handles this department single-handedly!
              </OneManArmySubtitle>
            </OneManArmyContainer>
          )}

          <BackFlipHint>
            <FlipIcon /> Click to flip back
          </BackFlipHint>
        </CardBack>
      </FlipCardInner>
    </FlipCardWrapper>
  );
};

const TeamPage = () => (
  <PageRoot>
    <Head>
      <title>Team | MXESA 2026-27</title>
      <meta
        name="description"
        content="Meet the founding committee of the Mechatronics Engineering Student's Association (MXESA) at MMIT Pune."
      />
      <meta name="theme-color" content="#1a1a1a" />
    </Head>

    <Header standalone />

    <main id="main">
      {/* Page Hero */}
      <PageHero>
        <Eyebrow>Est. 2026 · MXESA Founding Committee</Eyebrow>
        <PageTitle>
          <span>The People</span>
          <em>Behind MXESA.</em>
        </PageTitle>
        <PageSubtitle>
          Meet the founding committee of the Mechatronics Engineering
          Student&apos;s Association — the team driving innovation at MMIT,
          Lohagaon, Pune.
        </PageSubtitle>
      </PageHero>

      {/* Faculty Section */}
      <FacultySection>
        <SectionInner>
          <BackLink href="/">← Back to Home</BackLink>
          <SectionLabel>Faculty Guidance</SectionLabel>
          <SectionTitle>
            Under the <em>Guidance of.</em>
          </SectionTitle>
          <FacultyGrid>
            {FACULTY.map((f) => (
              <FacultyCard key={f.id}>
                <FacultyAvatar>{getInitials(f.name)}</FacultyAvatar>
                <FacultyInfo>
                  <FacultyRole>{f.role}</FacultyRole>
                  <FacultyName>{f.name}</FacultyName>
                </FacultyInfo>
              </FacultyCard>
            ))}
          </FacultyGrid>
        </SectionInner>
      </FacultySection>

      {/* All Members */}
      <MembersSection>
        <SectionInner>
          <SectionLabel>Student Committee</SectionLabel>
          <SectionTitle>
            The Founding <em>Committee.</em>
          </SectionTitle>
          <MembersGrid>
            {COMMITTEE.map((c) => (
              <FlipCard key={c.id} committee={c} />
            ))}
          </MembersGrid>
        </SectionInner>
      </MembersSection>
    </main>
  </PageRoot>
);

export default TeamPage;
