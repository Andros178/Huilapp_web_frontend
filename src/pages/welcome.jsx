"use client";

import { useNavigate } from "react-router-dom";
import {
    Play,
} from "lucide-react";
import styled from "styled-components";
import Footer from "../components/Footer";

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Header = styled.header`
  background-color: #0d9488;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  margin: 16px 16px 0 16px;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Logo = styled.h1`
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const AuthButton = styled.button`
  background-color: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 40px;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 40px 24px;
    gap: 30px;
  }

  @media (max-width: 768px) {
    padding: 30px 16px;
    gap: 20px;
  }
`;

const HeroContent = styled.div`
  flex: 1;

  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const HeroTitle = styled.h2`
  font-size: 48px;
  font-weight: bold;
  color: #000000;
  margin: 0 0 20px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 30px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PrimaryButton = styled.button`
  background-color: #0d9488;
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0d7a72;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  background-color: #0d9488;
  transform: rotate(45deg);
  border-radius: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 90%;
    height: 90%;
    object-fit: cover;
    transform: rotate(-45deg);
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const AppPromotionSection = styled.section`
  background-color: #0d9488;
  padding: 60px 24px;
  color: #ffffff;
  margin: 40px 0;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const PromotionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const PromotionContent = styled.div`
  flex: 1;

  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const PromotionTitle = styled.h3`
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 20px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const PromotionText = styled.p`
  font-size: 16px;
  margin: 0 0 30px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PlayStoreButton = styled.a`
  background-color: #ffffff;
  color: #0d9488;
  border: none;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

const PromotionImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const ServicesSection = styled.section`
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  margin: 0 0 50px 0;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 30px;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ServiceCard = styled.div`
  background-color: #f5f5dc;
  border: 2px solid #d4af37;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
`;

const ServiceCardImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const ServiceCardContent = styled.div`
  flex: 1;
`;

const ServiceCardTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CTASection = styled.section`
  background-color: #1a1a1a;
  background-image: url("/placeholder.svg?height=400&width=1200");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #ffffff;
  padding: 100px 24px;
  text-align: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 42px;
  font-weight: bold;
  margin: 0 0 20px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CTAText = styled.p`
  font-size: 16px;
  margin: 0 0 30px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const VideoSection = styled.section`
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const VideoPlaceholder = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayButton = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const VideoDuration = styled.span`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const VideoContent = styled.div`
  flex: 1;
`;

const VideoTitle = styled.h3`
  font-size: 28px;
  font-weight: bold;
  color: #0d9488;
  margin: 0 0 20px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const VideoDescription = styled.p`
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 15px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// Main Component
export default function Welcome() {
    const navigate = useNavigate();

    return (
        <PageContainer>
            {/* Header */}
            <Header>
                <Logo>HuilApp</Logo>
                <AuthButton onClick={() => navigate("/login")}>
                    Iniciar sesión / Registrarse
                </AuthButton>
            </Header>

            {/* Hero Section */}
            <HeroSection>
                <HeroContent>
                    <HeroTitle>
                        Descubre el Huila: Naturaleza, cultura y aventura en un solo lugar.
                    </HeroTitle>
                    <HeroSubtitle>
                        Explora rutas, hospedajes, restaurantes y mucho más desde nuestra
                        plataforma interactiva.
                    </HeroSubtitle>
                    <PrimaryButton onClick={() => navigate("/locations")}>
                        Explorar destinos
                    </PrimaryButton>
                </HeroContent>
                <HeroImage>
                    <HeroImageWrapper>
                        <img
                            src="/placeholder.svg?height=300&width=300"
                            alt="Desierto de Tatacoa"
                            loading="lazy"
                        />
                    </HeroImageWrapper>
                </HeroImage>
            </HeroSection>

            {/* App Promotion Section */}
            <AppPromotionSection>
                <PromotionContainer>
                    <PromotionContent>
                        <PromotionTitle>
                            Descarga la app y vive el Huila como nunca antes
                        </PromotionTitle>
                        <PromotionText>
                            Explora los paisajes mágicos del Huila, encuentra hospedajes,
                            restaurantes y rutas turísticas en tiempo real.
                        </PromotionText>
                        <PlayStoreButton
                            href="https://play.google.com/store"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Play size={20} />
                            Play Store
                        </PlayStoreButton>
                    </PromotionContent>
                    <PromotionImage>
                        <img
                            src="/placeholder.svg?height=400&width=250"
                            alt="App Screenshots"
                            loading="lazy"
                        />
                    </PromotionImage>
                </PromotionContainer>
            </AppPromotionSection>

            {/* Services Section */}
            <ServicesSection>
                <SectionTitle>SERVICIOS</SectionTitle>
                <ServicesGrid>
                    <ServiceCard>
                        <ServiceCardImage
                            src="/placeholder.svg?height=100&width=100"
                            alt="Hoteles"
                            loading="lazy"
                        />
                        <ServiceCardContent>
                            <ServiceCardTitle>
                                Hoteles y hospedajes pet friendly
                            </ServiceCardTitle>
                        </ServiceCardContent>
                    </ServiceCard>

                    <ServiceCard>
                        <ServiceCardImage
                            src="/placeholder.svg?height=100&width=100"
                            alt="Restaurantes"
                            loading="lazy"
                        />
                        <ServiceCardContent>
                            <ServiceCardTitle>
                                Restaurantes y gastronomía local
                            </ServiceCardTitle>
                        </ServiceCardContent>
                    </ServiceCard>

                    <ServiceCard>
                        <ServiceCardImage
                            src="/placeholder.svg?height=100&width=100"
                            alt="Mapa GPS"
                            loading="lazy"
                        />
                        <ServiceCardContent>
                            <ServiceCardTitle>Mapa interactivo con GPS</ServiceCardTitle>
                        </ServiceCardContent>
                    </ServiceCard>

                    <ServiceCard>
                        <ServiceCardImage
                            src="/placeholder.svg?height=100&width=100"
                            alt="Chatbot"
                            loading="lazy"
                        />
                        <ServiceCardContent>
                            <ServiceCardTitle>
                                Chatbot con información de sitios
                            </ServiceCardTitle>
                        </ServiceCardContent>
                    </ServiceCard>

                    <ServiceCard>
                        <ServiceCardImage
                            src="/placeholder.svg?height=100&width=100"
                            alt="Rutas"
                            loading="lazy"
                        />
                        <ServiceCardContent>
                            <ServiceCardTitle>Rutas turísticas y destinos</ServiceCardTitle>
                        </ServiceCardContent>
                    </ServiceCard>

                    <ServiceCard>
                        <ServiceCardImage
                            src="/placeholder.svg?height=100&width=100"
                            alt="Reseñas"
                            loading="lazy"
                        />
                        <ServiceCardContent>
                            <ServiceCardTitle>Reseñas y calificaciones</ServiceCardTitle>
                        </ServiceCardContent>
                    </ServiceCard>
                </ServicesGrid>
            </ServicesSection>

            {/* CTA Section */}
            <CTASection>
                <CTAContent>
                    <CTATitle>No esperes a que te lo cuenten</CTATitle>
                    <CTAText>
                        Explora sus paisajes, saborea su cultura y descubre experiencias
                        únicas con nuestra app de turismo interactiva.
                    </CTAText>
                    <PrimaryButton onClick={() => navigate("/register")}>
                        comienza tu aventura
                    </PrimaryButton>
                </CTAContent>
            </CTASection>

            {/* Video Section */}
            <VideoSection>
                <VideoContainer>
                    <VideoPlaceholder>
                        <img
                            src="/placeholder.svg?height=400&width=600"
                            alt="Huila Video"
                            loading="lazy"
                        />
                        <PlayButton>
                            <Play size={40} color="#ffffff" fill="#ffffff" />
                        </PlayButton>
                        <VideoDuration>5:08</VideoDuration>
                    </VideoPlaceholder>
                    <VideoContent>
                        <VideoTitle>No solo visites el Huila, vívelo</VideoTitle>
                        <VideoDescription>
                            Con nuestra app puedes explorar rutas, encontrar hospedajes, leer
                            reseñas reales y planificar cada detalle de tu aventura.
                        </VideoDescription>
                        <VideoDescription>
                            Descubre la magia, su gente y su cultura con una experiencia
                            digital diseñada para aventureros como tú.
                        </VideoDescription>
                    </VideoContent>
                </VideoContainer>
            </VideoSection>

            {/* Footer */}
            <Footer />
        </PageContainer>
    );
}
