import Link from 'next/link';
import { timeline } from 'data/content.mjs';

import {
  Eyebrow,
  TimelineCard,
  TimelineCardCopy,
  TimelineCardTitle,
  TimelineGrid,
  TimelineHeading,
  TimelineIntro,
  TimelineIntroCopy,
  TimelineRoot,
  TimelineYear,
} from './TimelineSection.styles';

const TimelineSection = () => (
  <TimelineRoot id="history" aria-labelledby="history-title">
    <TimelineIntro>
      <div>
        <Eyebrow>{timeline.eyebrow}</Eyebrow>
        <TimelineHeading id="history-title">
          {timeline.heading.lead} <em>{timeline.heading.accent}</em>
        </TimelineHeading>
      </div>
      <TimelineIntroCopy>{timeline.intro}</TimelineIntroCopy>
    </TimelineIntro>

    <TimelineGrid>
      {timeline.eras.map((era) => {
        const card = (
          <TimelineCard key={era.year}>
            <TimelineYear>{era.year}</TimelineYear>
            <TimelineCardTitle>{era.title}</TimelineCardTitle>
            <TimelineCardCopy>{era.copy}</TimelineCardCopy>
            {era.cta && (
              <div style={{ marginTop: '16px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: '#e02873', // the pink color matching the site theme or adjust as needed
                    color: '#131112', // the ink color
                    border: '2px solid #131112',
                    boxShadow: '3px 3px 0 #850b3e', // maroon
                    fontWeight: '650',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  {era.cta}
                </span>
              </div>
            )}
          </TimelineCard>
        );

        if (era.href) {
          return (
            <Link
              key={era.year}
              href={era.href}
              style={{ textDecoration: 'none' }}
            >
              {card}
            </Link>
          );
        }

        return card;
      })}
    </TimelineGrid>
  </TimelineRoot>
);

export default TimelineSection;
