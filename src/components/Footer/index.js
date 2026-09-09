import styled from 'styled-components';
import { colors, fonts } from 'styles/tokens';

const FooterRoot = styled.footer`
  padding: 40px 20px;
  background: ${colors.forestDeep};
  color: ${colors.paper};
  text-align: center;
  font-family: ${fonts.mono};
  border-top: 4px solid ${colors.ink};
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  font-size: 14px;
`;

const FooterLink = styled.a`
  color: ${colors.sky};
  text-decoration: underline;

  &:hover {
    color: ${colors.white};
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const Footer = () => (
  <FooterRoot>
    <div>
      <strong>MXESA - Department of Mechatronics Engineering</strong>
      <br />
      MMIT, Lohagaon, Pune
    </div>
    <div>
      <FooterLink
        href="https://mmit.edu.in/"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://mmit.edu.in/
      </FooterLink>
    </div>
    <LinksContainer>
      <FooterLink href="#">Instagram</FooterLink>
      <FooterLink href="#">LinkedIn</FooterLink>
      <FooterLink href="#">Contact Us</FooterLink>
    </LinksContainer>
    <div style={{ marginTop: '20px', fontSize: '12px' }}>
      Designed and developed by <FooterLink href="https://povsanyam.me" target="_blank" rel="noopener noreferrer">SANYAM CHAVAN</FooterLink>
    </div>
  </FooterRoot>
);

export default Footer;
