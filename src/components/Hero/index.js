import { hero } from 'data/content.mjs';
import { colors } from 'styles/tokens';
import Ribbon from 'components/Ribbon';

import {
  ColumnsSkyline,
  StairsLeft,
  StairsRight,
  StepsTowers,
} from './HeroGeometry';

import {
  DecoBottomLeft,
  DecoBottomRight,
  DecoTopLeft,
  DecoTopRight,
  Eyebrow,
  EyebrowLine,
  HeroActions,
  HeroButton,
  HeroDeck,
  HeroHeading,
  HeroInner,
  HeroPartnerChip,
  HeroPartnerGroup,
  HeroPartnerLabel,
  HeroPartnerLink,
  HeroPartners,
  HeroPartnerTimes,
  HeroRoot,
  HeroSecondaryButton,
  HeroSquare,
  HeroSquares,
} from './Hero.styles';

const ACCENT_COLORS = [colors.orange, colors.sky, colors.ochre, colors.pink];

const Hero = () => (
  <HeroRoot id="top" aria-labelledby="hero-title">
    <Ribbon />
    <DecoTopLeft aria-hidden="true">
      <StairsLeft />
    </DecoTopLeft>
    <DecoTopRight aria-hidden="true">
      <StairsRight />
    </DecoTopRight>
    <DecoBottomLeft aria-hidden="true">
      <ColumnsSkyline />
    </DecoBottomLeft>
    <DecoBottomRight aria-hidden="true">
      <StepsTowers />
    </DecoBottomRight>
    <HeroInner>
      <HeroSquares aria-hidden="true">
        {ACCENT_COLORS.map((color) => (
          <HeroSquare key={color} $color={color} />
        ))}
      </HeroSquares>
      <Eyebrow>
        {hero.eyebrow.map((line) => (
          <EyebrowLine key={line}>{line}</EyebrowLine>
        ))}
      </Eyebrow>
      <HeroHeading id="hero-title">
        <span>{hero.heading.lead}</span> <em>{hero.heading.accent}</em>
      </HeroHeading>
      <HeroDeck>{hero.deck}</HeroDeck>
      <HeroActions>
        {/* Both asks are links now. The host CTA hands off to /host/,
            which carries the formats and the application; the attendee
            CTA hands off to the published directory, which is what the
            old "notify me" interest form was standing in for. */}
        <HeroButton href="#history">{hero.cta}</HeroButton>
        <HeroSecondaryButton href="#get-involved">
          {hero.secondaryCta}
        </HeroSecondaryButton>
      </HeroActions>
      <HeroPartners>
        <HeroPartnerGroup>
          <HeroPartnerLabel>{hero.poweredByLabel}</HeroPartnerLabel>
          <HeroPartnerChip>
            <HeroPartnerLink href="https://mmit.edu.in/" aria-label="MMIT Pune">
              <span
                style={{
                  fontFamily: 'Arial Narrow, Impact, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#10201d',
                  letterSpacing: '0.05em',
                }}
              >
                ⚙ Mechatronics · MMIT
              </span>
            </HeroPartnerLink>
          </HeroPartnerChip>
        </HeroPartnerGroup>
      </HeroPartners>
    </HeroInner>
  </HeroRoot>
);

export default Hero;
