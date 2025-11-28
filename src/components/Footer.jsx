import styled from 'styled-components';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

// Styled Components
const FooterWrapper = styled.footer`
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 60px 24px;
  margin-top: 60px;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  flex: 1;
`;

const FooterTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 20px 0;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #cccccc;
  margin: 0 0 10px 0;
  line-height: 1.6;
`;

const FooterLink = styled.a`
  color: #0d9488;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  background-color: #0d9488;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0d7a72;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MapSection = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapImage = styled.img`
  width: 100%;
  max-width: 250px;
  height: auto;
`;

// Footer Component
export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterSection>
          <FooterTitle>HuilApp</FooterTitle>
          <FooterText>
            Descubre los paisajes mágicos del Huila, encuentra hospedajes,
            restaurantes y rutas turísticas en tiempo real.
          </FooterText>
          <SocialLinks>
            <SocialIcon
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} />
            </SocialIcon>
            <SocialIcon
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} />
            </SocialIcon>
            <SocialIcon
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={20} />
            </SocialIcon>
            <SocialIcon
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube size={20} />
            </SocialIcon>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Contacto</FooterTitle>
          <FooterText>
            <MapPin
              size={16}
              style={{ display: "inline-block", marginRight: "8px" }}
            />
            Neiva, Huila, Calle 7 No. 5 - 102
          </FooterText>
          <FooterText>
            <Mail
              size={16}
              style={{ display: "inline-block", marginRight: "8px" }}
            />
            <FooterLink href="mailto:info@huilamovil.co">
              info@huilamovil.co
            </FooterLink>
          </FooterText>
          <FooterText>
            <Phone
              size={16}
              style={{ display: "inline-block", marginRight: "8px" }}
            />
            <FooterLink href="tel:+573016046969">+57 301 604-6969</FooterLink>
          </FooterText>
        </FooterSection>

        <FooterSection>
          <MapSection>
            <MapImage
              src="src\assets\huilapp_imagotipo.png?height=100&width=150"
              alt="Mapa del Huila"
              loading="lazy"
            />
          </MapSection>
        </FooterSection>
      </FooterContainer>
    </FooterWrapper>
  );
}
