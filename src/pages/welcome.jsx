"use client";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Play,
} from "lucide-react";
import { FaMapPin as MapPin } from "react-icons/fa";
import { MdStar as Star } from "react-icons/md";
import styled from "styled-components";
import Footer from "../components/Footer";

import imgTatacoa from '../assets/Tatacoa.png';
import imgAgustin from '../assets/Agustin.jpg';
import imgNevado from '../assets/Nevado.jpg';
import imgBetania from '../assets/Betania.jpg';
import imgGuacharo from '../assets/Guacharo.jpg';
import imgPitalito from '../assets/Pitalito.jpg';
import imgBambuco from '../assets/Bambuco.JPG';
import imgJagua from '../assets/Jagua.jpeg';
import imgJunero from '../assets/Junero.jpg';

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
  font-weight: bold;
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

  img {
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 20px;
  }

  @media (max-width: 1024px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    img {
      max-width: 300px;
    }
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
  background-image: url("src/assets/desierto_tatacoa.png?height=400&width=1200");
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

// Destinos Styles
const DestinosSection = styled.section`
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const DestinosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const DestinoCard = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const DestinoImg = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: .3s;
  ${DestinoCard}:hover & {
    transform: scale(1.1);
  }
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const DestinoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const DestinoName = styled.h3`
  margin: 0;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const DestinoLugar = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const SmallButton = styled.button`
  background: #0d9488;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;

// Eventos Styles
const EventosSection = styled.section`
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const EventosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 35px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const EventoCard = styled.div`
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: .3s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const EventoImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  @media (max-width: 768px) {
    height: 180px;
  }
`;

const EventoInfo = styled.div`
  padding: 20px;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const EventoTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

const EventoFecha = styled.p`
  font-size: 14px;
  margin-bottom: 15px;
  opacity: 0.7;
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 12px;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ModalContent = styled.div`
  background: #fff;
  width: 85%;
  max-width: 900px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
    max-height: 85vh;
    border-radius: 16px 16px 0 0;
  }
`;

const ModalImage = styled.img`
  width: 40%;
  object-fit: cover;
  height: 100%;
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 768px) {
    padding: 16px;
    overflow-y: auto;
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  color: #0d9488;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ModalDate = styled.p`
  margin: 0;
  color: #666;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ModalDescription = styled.p`
  color: #333;
  line-height: 1.5;
  flex: 1;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ModalCloseButton = styled.button`
  background: #0d9488;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-end;
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
    align-self: stretch;
  }
`;

// =============================== DATOS ===============================
const destinos = [
  { id: 1, nombre: "Desierto de la Tatacoa", lugar: "Villavieja", img: imgTatacoa },
  { id: 2, nombre: "Parque Arqueológico", lugar: "San Agustín", img: imgAgustin },
  { id: 3, nombre: "Nevado del Huila", lugar: "Zona volcánica", img: imgNevado }, 
  { id: 4, nombre: "Betania", lugar: "Huila", img: imgBetania },
  { id: 5, nombre: "Cueva del Guácharo", lugar: "Paicol", img: imgGuacharo },
  { id: 6, nombre: "Pitalito", lugar: "Huila", img: imgPitalito },
];

const eventos = [
  { id: 1, nombre: "Festival del Bambuco", fecha: "Junio", img: imgBambuco, descripcion: "El Festival del Bambuco es una de las celebraciones culturales más representativas del departamento del Huila. Durante varios días, las calles se llenan de música típica, comparsas, reinados folclóricos y muestras artísticas que resaltan la identidad huilense." },
  { id: 2, nombre: "Festival de las Brujas", fecha: "Agosto", img: imgJagua, descripcion: "El Festival de las Brujas, celebrado en el municipio de La Jagua, es una fiesta cargada de magia, mitología y tradición oral. Durante este evento se realizan desfiles temáticos, concursos de disfraces y presentaciones musicales." },
  { id: 3, nombre: "Festival de San Juanero", fecha: "Julio", img: imgJunero, descripcion: "El Festival de San Juanero rinde homenaje a uno de los ritmos más emblemáticos del Huila: el Sanjuanero Huilense. En esta festividad se realizan concursos de interpretación y baile, desfiles folclóricos y encuentros culturales." },
  { id: 4, nombre: "Festival del Bambuco", fecha: "Junio", img: imgBambuco, descripcion: "Esta versión del Festival del Bambuco continúa resaltando la riqueza cultural del Huila con un enfoque en la participación comunitaria. Los asistentes disfrutan de tarimas musicales y ferias gastronómicas." },
  { id: 5, nombre: "Festival de las Brujas", fecha: "Agosto", img: imgJagua, descripcion: "En esta celebración mística, el Festival de las Brujas destaca las leyendas tradicionales y el folclor huilense. Los visitantes pueden recorrer mercados artesanales y presenciar rituales simbólicos." },
  { id: 6, nombre: "Festival de San Juanero", fecha: "Julio", img: imgJunero, descripcion: "Otra edición del Festival de San Juanero celebra con intensidad la música y danza tradicional del Huila. Este evento reúne a bailarines, músicos y familias enteras." },
];

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
                    <PrimaryButton onClick={() => { window.scrollTo(0, 0); navigate("/login")}}>
                        Explorar destinos
                    </PrimaryButton>
                </HeroContent>
                <HeroImage>
                    <img
                        src="src\assets\hero_section.png?height=300&width=300"
                        alt="Desierto de Tatacoa"
                        loading="lazy"
                    />
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
                            src="src\assets\app_screenshots.png?height=400&width=250"
                            alt="App Screenshots"
                            loading="lazy"
                        />
                    </PromotionImage>
                </PromotionContainer>
            </AppPromotionSection>

            {/* Destinos populares */}
            <DestinosSection>
                <SectionTitle>Destinos populares</SectionTitle>
                <DestinosGrid>
                    {destinos.map((item, index) => (
                        <DestinoCard key={index}>
                            <DestinoImg src={item.img} />
                            <DestinoOverlay>
                                <DestinoName>{item.nombre}</DestinoName>
                                <DestinoLugar><MapPin /> {item.lugar}</DestinoLugar>
                            </DestinoOverlay>
                        </DestinoCard>
                    ))}
                </DestinosGrid>
            </DestinosSection>

            {/* Eventos */}
            <EventosSection>
                <SectionTitle>Eventos</SectionTitle>
                <EventosGrid>
                    {eventos.map((item, index) => (
                        <EventoCard key={index}>
                            <EventoImg src={item.img} />
                            <EventoInfo>
                                <EventoTitle>{item.nombre}</EventoTitle>
                                <EventoFecha>{item.fecha}</EventoFecha>
                                <SmallButton onClick={() => { window.scrollTo(0, 0); navigate("/login"); }}>Ver más <Star /></SmallButton>
                            </EventoInfo>
                        </EventoCard>
                    ))}
                </EventosGrid>
            </EventosSection>

            {/* CTA Section */}
            <CTASection>
                <CTAContent>
                    <CTATitle>No esperes a que te lo cuenten</CTATitle>
                    <CTAText>
                        Explora sus paisajes, saborea su cultura y descubre experiencias
                        únicas con nuestra app de turismo interactiva.
                    </CTAText>
                    <PrimaryButton onClick={() => { window.scrollTo(0, 0); navigate("/register"); }}>
                        COMIENZAR MI AVENTURA
                    </PrimaryButton>
                </CTAContent>
            </CTASection>

            {/* Video Section */}
            <VideoSection>
                <VideoContainer>
                    <VideoPlaceholder>
                        <img
                            src="src\assets\huila_video.jpg?height=400&width=600"
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
