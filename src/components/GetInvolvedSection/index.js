import Link from 'next/link';
import { getInvolved } from 'data/content.mjs';

import {
  Eyebrow,
  InvolvedCard,
  InvolvedCardCopy,
  InvolvedCardTitle,
  InvolvedGrid,
  InvolvedHeading,
  InvolvedIntro,
  InvolvedIntroCopy,
  InvolvedLink,
  InvolvedRoot,
  InvolvedTag,
} from './GetInvolvedSection.styles';

const GetInvolvedSection = () => (
  <InvolvedRoot id="get-involved" aria-labelledby="get-involved-title">
    <InvolvedIntro>
      <div>
        <Eyebrow>{getInvolved.eyebrow}</Eyebrow>
        <InvolvedHeading id="get-involved-title">
          {getInvolved.heading.lead} <em>{getInvolved.heading.accent}</em>
        </InvolvedHeading>
      </div>
      <InvolvedIntroCopy>{getInvolved.intro}</InvolvedIntroCopy>
    </InvolvedIntro>

    <InvolvedGrid>
      {getInvolved.cards.map((card) => (
        <InvolvedCard key={card.id}>
          <InvolvedTag>{card.tag}</InvolvedTag>
          <InvolvedCardTitle>{card.title}</InvolvedCardTitle>
          {card.copy.map((paragraph) => (
            <InvolvedCardCopy key={paragraph}>{paragraph}</InvolvedCardCopy>
          ))}
          <InvolvedLink href="/team">{card.cta}</InvolvedLink>
        </InvolvedCard>
      ))}
    </InvolvedGrid>

    <div style={{ textAlign: 'center', marginTop: '48px' }}>
      <Link
        href="/team"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          border: '2px solid #10201d',
          background: '#e53927',
          color: '#10201d',
          fontFamily: '"Martian Mono", monospace',
          fontWeight: '700',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          boxShadow: '5px 5px 0 #671912',
          textTransform: 'uppercase',
        }}
      >
        View All Members →
      </Link>
    </div>
  </InvolvedRoot>
);

export default GetInvolvedSection;
