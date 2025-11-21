import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiChevronRight as ChevronRight, FiArrowRight as ArrowRight } from "react-icons/fi";
import { FaMapPin as MapPin, FaCompass as Compass } from "react-icons/fa";
import { MdCamera as Camera, MdStar as Star } from "react-icons/md";
import Footer from "../../components/Footer";

import imgHero from '../../assets/images/Desierto.png';
import imgCicla from '../../assets/images/explore.png';
import imgTatacoa from '../../assets/images/sitios/Tatacoa.png';
import imgAgustin from '../../assets/images/sitios/Agustin.jpg';
import imgNevado from '../../assets/images/sitios/Nevado.jpg';
import imgBetania from '../../assets/images/sitios/Betania.jpg';
import imgGuacharo from '../../assets/images/sitios/Guacharo.jpg';
import imgPitalito from '../../assets/images/sitios/Pitalito.jpg';
import imgBambuco from '../../assets/images/eventos/Bambuco.jpg';
import imgJagua from '../../assets/images/eventos/Jagua.jpeg';
import imgJunero from '../../assets/images/eventos/Junero.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);

  const openModal = (evento) => {
    setSelectedEvento(evento);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEvento(null);
    setModalVisible(false);
  };

  return (
    <Container>
      <Hero>
        <HeroImage src={imgHero} />
        <HeroOverlay />
        <HeroContent>
          <HeroTitle>Explora el corazón del Huila</HeroTitle>
          <HeroSubtitle>Encuentra destinos, rutas, eventos y experiencias únicas</HeroSubtitle>
          <HeroButton onClick={() => navigate("/maps")}>Ver Mapa <ArrowRight /></HeroButton>
        </HeroContent>
      </Hero>

      <Section>
        <Explora>
          <ExploraImage src={imgCicla} />
          <ExploraText>
            <SectionTitle>Explora el Huila</SectionTitle>
            <SectionParagraph>Vive experiencias únicas recorriendo los paisajes cafeteros, montañas, ríos y culturas locales que hacen del Huila un destino inolvidable.</SectionParagraph>
            <SmallButton onClick={() => navigate("/maps")}>Explorar <ChevronRight /></SmallButton>
          </ExploraText>
        </Explora>
      </Section>

      {modalVisible && selectedEvento && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage src={selectedEvento.img} alt={selectedEvento.nombre} />
            <ModalBody>
              <ModalTitle>{selectedEvento.nombre}</ModalTitle>
              <ModalDate>{selectedEvento.fecha}</ModalDate>
              <ModalDescription>{selectedEvento.descripcion}</ModalDescription>
              <ModalCloseButton onClick={closeModal}>Cerrar</ModalCloseButton>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      <SectionGray style={{ backgroundColor: '#008073' }}>
        <IABox>
          <IAIcon><Compass style={{ color: '#008073' }} size={40} /></IAIcon>
          <SectionTitle>Planificación con Inteligencia Artificial</SectionTitle>
          <SectionParagraph>Obtén recomendaciones automáticas basadas en tus intereses y ubicación.</SectionParagraph>
          <HeroButton style={{ margin: '0 auto', backgroundColor: '#008073', color: '#fff' }} onClick={() => navigate("/chat")}>Probar IA</HeroButton>
        </IABox>
      </SectionGray>

      <Section>
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
      </Section>

      <SectionGray>
        <SectionTitle style={{color:'#fff'}}>Planifica tu viaje</SectionTitle>
        <PlanificaGrid>
          {planifica.map((item, index) => (
            <PlanBox key={index} onClick={() => navigate("/maps")}> 
              <PlanIcon>{item.icon}</PlanIcon>
              <PlanTitle>{item.title}</PlanTitle>
            </PlanBox>
          ))}
        </PlanificaGrid>
      </SectionGray>

      <Section>
        <Inspira>
          <InspiraImg src={imgPitalito} />
          <InspiraOverlay />
          <InspiraText>"Viajar te conecta con lo que realmente importa."</InspiraText>
        </Inspira>
      </Section>

      <Section>
        <SectionTitle>Eventos</SectionTitle>
        <EventosGrid>
          {eventos.map((item, index) => (
            <EventoCard key={index}>
              <EventoImg src={item.img} />
              <EventoInfo>
                <EventoTitle>{item.nombre}</EventoTitle>
                <EventoFecha>{item.fecha}</EventoFecha>
                <SmallButton onClick={() => openModal(item)}>Ver más <ChevronRight /></SmallButton>
              </EventoInfo>
            </EventoCard>
          ))}
        </EventosGrid>
      </Section>
      <Footer />
    </Container>
  );
};

export default Home;

// =============================== DATOS ===============================
const destinos = [
  { id: 1, nombre: "Desierto de la Tatacoa", lugar: "Villavieja", img: [imgTatacoa] },
  { id: 2, nombre: "Parque Arqueológico", lugar: "San Agustín", img: [imgAgustin] },
  { id: 3, nombre: "Nevado del Huila", lugar: "Zona volcánica", img: [imgNevado] }, 
  { id: 4, nombre: "Betania", lugar: "Huila", img: [imgBetania] },
  { id: 5, nombre: "Cueva del Guácharo", lugar: "Paicol", img: [imgGuacharo] },
  { id: 6, nombre: "Pitalito", lugar: "Huila", img: [imgPitalito] },
];

const planifica = [
  { title: "Hospedajes", icon: <Camera size={32} /> },
  { title: "Gastronomía", icon: <Star size={32} /> },
  { title: "Artesanías", icon: <MapPin size={32} /> },
  { title: "Actividades", icon: <Compass size={32} /> },
];

const eventos = [
  { id: 1, nombre: "Festival del Bambuco", fecha: "Junio", img: imgBambuco, descripcion: "El Festival del Bambuco es una de las celebraciones culturales más representativas del departamento del Huila. Durante varios días, las calles se llenan de música típica, comparsas, reinados folclóricos y muestras artísticas que resaltan la identidad huilense." },
  { id: 2, nombre: "Festival de las Brujas", fecha: "Agosto", img: imgJagua, descripcion: "El Festival de las Brujas, celebrado en el municipio de La Jagua, es una fiesta cargada de magia, mitología y tradición oral. Durante este evento se realizan desfiles temáticos, concursos de disfraces y presentaciones musicales." },
  { id: 3, nombre: "Festival de San Juanero", fecha: "Julio", img: imgJunero, descripcion: "El Festival de San Juanero rinde homenaje a uno de los ritmos más emblemáticos del Huila: el Sanjuanero Huilense. En esta festividad se realizan concursos de interpretación y baile, desfiles folclóricos y encuentros culturales." },
  { id: 4, nombre: "Festival del Bambuco", fecha: "Junio", img: imgBambuco, descripcion: "Esta versión del Festival del Bambuco continúa resaltando la riqueza cultural del Huila con un enfoque en la participación comunitaria. Los asistentes disfrutan de tarimas musicales y ferias gastronómicas." },
  { id: 5, nombre: "Festival de las Brujas", fecha: "Agosto", img: imgJagua, descripcion: "En esta celebración mística, el Festival de las Brujas destaca las leyendas tradicionales y el folclor huilense. Los visitantes pueden recorrer mercados artesanales y presenciar rituales simbólicos." },
  { id: 6, nombre: "Festival de San Juanero", fecha: "Julio", img: imgJunero, descripcion: "Otra edición del Festival de San Juanero celebra con intensidad la música y danza tradicional del Huila. Este evento reúne a bailarines, músicos y familias enteras." },
];

// =============================== STYLES ===============================
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
  @media (max-width: 768px) {
    gap: 40px;
  }
`;

const Hero = styled.div`
  position: relative;
  width: 100%;
  height: 70vh;
  border-radius: 20px;
  overflow: hidden;
  @media (max-width: 768px) {
    height: 30vh;
    border-radius: 0;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  color: #fff;
  @media (max-width: 768px) {
    bottom: 30px;
    left: 20px;
    right: 20px;
  }
`; 

const HeroTitle = styled.h1`
  font-size: 48px;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  margin: 10px 0 20px;
  @media (max-width: 768px) {
    font-size: 15px;
    margin: 8px 0 16px;
  }
`;

const HeroButton = styled.button`
  background: #fff;
  color: #000;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  gap: 6px;
  align-items: center;
  font-weight: bold;
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const Section = styled.section`
  padding: 0 40px;
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SectionGray = styled.section`
  padding: 60px 40px;
  background: #008073;
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 20px;
  color: #008073;
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 16px;
  }
`;

const SectionParagraph = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.5;
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

const Explora = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ExploraImage = styled.img`
  width: 45%;
  border-radius: 20px;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 100%;
    border-radius: 12px;
  }
`;

const ExploraText = styled.div`
  width: 55%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SmallButton = styled.button`
  background: #008073;
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

const IABox = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 700px;
  margin: auto;
  @media (max-width: 768px) {
    padding: 24px 16px;
    border-radius: 12px;
  }
`;

const IAIcon = styled.div`
  margin-bottom: 20px;
  @media (max-width: 768px) {
    margin-bottom: 12px;
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

const PlanificaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const PlanBox = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  color: #008073;
  cursor: pointer;
  transition: .3s;
  border: 1px solid #eee;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  @media (max-width: 768px) {
    padding: 20px 12px;
    border-radius: 12px;
  }
`;

const PlanIcon = styled.div`
  margin-bottom: 15px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const PlanTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Inspira = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  @media (max-width: 768px) {
    height: 250px;
    border-radius: 12px;
  }
`;

const InspiraImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const InspiraOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
`;

const InspiraText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  z-index: 2;
  font-size: 26px;
  font-weight: 600;
  padding: 20px;
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 16px;
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
  color: #008073;
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
  background: #008073;
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