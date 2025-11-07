import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import CaptusImg from '../../assets/images/carrusel/Captus.png';
import DersiertoImg from '../../assets/images/carrusel/Desierto.png';
import IglesiaImg from '../../assets/images/carrusel/Iglesia.png';
import LagoImg from '../../assets/images/carrusel/Lago.png';
import PiscinaImg from '../../assets/images/carrusel/Piscina.png';
import CiclaImg from '../../assets/images/explore.png'

const carouselImages = [
  { id: 1, img: CaptusImg },
  { id: 2, img: DersiertoImg },
  { id: 3, img: IglesiaImg },
  { id: 4, img: LagoImg },
  { id: 5, img: PiscinaImg },
];

const sitios = [
  {
    nombre: "Desierto de la Tatacoa",
    ubicacion: "Villavieja",
    imagen: "https://picsum.photos/400/300?random=6",
    video: "https://www.youtube.com/embed/BcPfW4Bni2g",
    descripcion:
      "El Desierto de la Tatacoa es uno de los paisajes más sorprendentes del Huila y de Colombia. Aunque se le conoce como desierto, en realidad es un bosque seco tropical que antiguamente fue un mar. Sus formaciones rocosas rojizas y grises, talladas por el viento y la lluvia, crean un escenario casi irreal. Es el lugar perfecto para la observación astronómica, ya que cuenta con uno de los cielos más limpios del país.",
  },
  {
    nombre: "Nevado del Huila",
    ubicacion: "Sur del departamento",
    imagen: "https://picsum.photos/400/300?random=7",
    video: "https://www.youtube.com/embed/BcPfW4Bni2g",
    descripcion:
      "El Nevado del Huila es el pico más alto del centro y sur de Colombia, y uno de los volcanes más emblemáticos de la Cordillera Central. Su cumbre nevada, que alcanza más de 5.300 metros sobre el nivel del mar, es un símbolo de majestuosidad natural y de respeto hacia la montaña.",
  },
  {
    nombre: "Parque Arqueológico de San Agustín",
    ubicacion: "San Agustín",
    imagen: "https://picsum.photos/400/300?random=8",
    video: "https://www.youtube.com/embed/BcPfW4Bni2g",
    descripcion:
      "El Parque Arqueológico de San Agustín es Patrimonio de la Humanidad declarado por la UNESCO. Alberga el mayor conjunto de monumentos religiosos y esculturas megalíticas de América Latina.",
  },
  {
    nombre: "Embalse de Betania",
    ubicacion: "Yaguará",
    imagen: "https://picsum.photos/400/300?random=9",
    video: "https://www.youtube.com/embed/BcPfW4Bni2g",
    descripcion:
      "El Embalse de Betania es un espejo de agua de gran belleza, resultado de la represa construida sobre el río Magdalena. Rodeado por montañas y vegetación, es el sitio ideal para practicar deportes náuticos.",
  },
  {
    nombre: "Cueva de los Guácharos",
    ubicacion: "Acevedo",
    imagen: "https://picsum.photos/400/300?random=10",
    video: "https://www.youtube.com/embed/BcPfW4Bni2g",
    descripcion:
      "El Parque Nacional Natural Cueva de los Guácharos protege ecosistemas únicos y espectaculares formaciones rocosas.",
  },
  {
    nombre: "Ruta del Café",
    ubicacion: "Pitalito",
    imagen: "https://picsum.photos/400/300?random=11",
    video: "https://www.youtube.com/embed/BcPfW4Bni2g",
    descripcion:
      "La Ruta del Café en Pitalito ofrece una experiencia sensorial completa, desde los cultivos en las montañas hasta la taza servida con aroma y sabor únicos.",
  },
];

const eventos = [
  {
    id: 1,
    image: "https://picsum.photos/400/300?random=12",
    title: "Festival del Bambuco",
    place: "📍 Neiva",
    date: "🗓️ Junio - Julio",
    description: "El evento más emblemático del Huila, lleno de folclor, música y tradición.",
  },
  {
    id: 2,
    image: "https://picsum.photos/400/300?random=13",
    title: "Fiesta del Sanjuanero",
    place: "📍 Neiva",
    date: "🗓️ Finales de junio",
    description: "Vive la alegría del Sanjuanero Huilense con danza, cultura y color.",
  },
  {
    id: 3,
    image: "https://picsum.photos/400/300?random=14",
    title: "Carnavalito de Pitalito",
    place: "📍 Pitalito",
    date: "🗓️ Enero",
    description: "Desfiles infantiles, música y diversión para toda la familia.",
  },
  {
    id: 4,
    image: "https://picsum.photos/400/300?random=15",
    title: "Festival de Brujas",
    place: "📍 La Jagua",
    date: "🗓️ Octubre",
    description: "Una noche mágica entre leyendas, desfiles y creatividad huilense.",
  },
  {
    id: 5,
    image: "https://picsum.photos/400/300?random=16",
    title: "Fiesta del Sanjuanero",
    place: "📍 Neiva",
    date: "🗓️ Finales de junio",
    description: "Vive la alegría del Sanjuanero Huilense con danza, cultura y color.",
  },
  {
    id: 6,
    image: "https://picsum.photos/400/300?random=17",
    title: "Festival del Bambuco",
    place: "📍 Neiva",
    date: "🗓️ Junio - Julio",
    description: "El evento más emblemático del Huila, lleno de folclor, música y tradición.",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mostrarTodo, setMostrarTodo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sitioSeleccionado, setSitioSeleccionado] = useState(null);
  const navigate = useNavigate();

  const mostrarSitios = mostrarTodo ? sitios : sitios.slice(0, 4);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <Container>
      {/* Carrusel */}
      <CarouselWrapper>
        <CarouselContainer>
          <CarouselImage src={carouselImages[currentIndex].img} alt="Carousel" />
        </CarouselContainer>

        <ArrowButton className="left" onClick={handlePrev}>
          <ChevronLeft size={24} />
        </ArrowButton>

        <ArrowButton className="right" onClick={handleNext}>
          <ChevronRight size={24} />
        </ArrowButton>
      </CarouselWrapper>

      {/* Puntos indicadores */}
      <DotsContainer>
        {carouselImages.map((_, index) => (
          <Dot key={index} active={currentIndex === index} />
        ))}
      </DotsContainer>

      {/* Título y texto */}
      <ExploreContainer>
  <ContentLeft>
    {/* Título y texto */}
    <TextContainer>
      <Title>Explora el Huila</Title>
      <Paragraph>
        Explora el corazón del sur colombiano. Te invitamos a visitar nuestro
        mapa interactivo y los comercios que allí encontrarás.
      </Paragraph>
    </TextContainer>

    {/* Botón a mapa */}
    <MapButton onClick={() => navigate("/maps")}>
      Navega por el mapa interactivo
    </MapButton>
  </ContentLeft>

  {/* Imagen cicla */}
  <CiclaImage src={CiclaImg} alt="Explore" />
</ExploreContainer>

      {/* Sección con fondo verde */}
      <GreenSection>
        <SectionSubtitle>Impulsado por IA</SectionSubtitle>
        <SectionTitle>
          ¿Tienes alguna duda? ¡Nuestro chat te ayudará a resolverla!
        </SectionTitle>
        <ChatButton onClick={() => navigate("/chat")}>
          <span>Comenzar</span>
          <IconContainer>
            <ArrowRight size={16} />
          </IconContainer>
        </ChatButton>
      </GreenSection>

      {/* Destinos */}
      <EventSection>
        <EventTitle>
          <span className="bold">Destinos </span>
          <span className="normal">en el Huila</span>
        </EventTitle>
        <EventSubtitle>No te pierdas los mejores destinos</EventSubtitle>
      </EventSection>

      {mostrarSitios.map((sitio, index) => (
        <SitioRow key={index} reverse={index % 2 === 1}>
          <SitioImage src={sitio.imagen} alt={sitio.nombre} />
          <SitioTextContainer reverse={index % 2 === 1}>
            <SitioName>{sitio.nombre}</SitioName>
            <SitioLocation>{sitio.ubicacion}</SitioLocation>
            <ExploreButton
              onClick={() => {
                setSitioSeleccionado(sitio);
                setModalVisible(true);
              }}
            >
              Explorar
            </ExploreButton>
          </SitioTextContainer>
        </SitioRow>
      ))}

      <ToggleButton onClick={() => setMostrarTodo(!mostrarTodo)}>
        {mostrarTodo ? "Ver menos destinos" : "Ver más destinos"}
      </ToggleButton>

      {/* Modal */}
      {modalVisible && sitioSeleccionado && (
        <Modal onClick={() => setModalVisible(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <VideoContainer>
              <iframe
                width="100%"
                height="100%"
                src={sitioSeleccionado.video}
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
            <InfoContainer>
              <ModalTitle>{sitioSeleccionado.nombre}</ModalTitle>
              <ModalUbicacion>📍 {sitioSeleccionado.ubicacion}</ModalUbicacion>
              <ModalDescripcion>{sitioSeleccionado.descripcion}</ModalDescripcion>
            </InfoContainer>
            <CloseButton onClick={() => setModalVisible(false)}>
              Cerrar
            </CloseButton>
          </ModalContent>
        </Modal>
      )}

      {/* Imagen de fondo */}
      <BackgroundSection>
        <BackgroundOverlay />
        <BackgroundText>
          <h2>No esperes a que te lo cuenten</h2>
          <p>
            Explora sus paisajes, saborea su cultura y descubre experiencias
            únicas con nuestro mapa interactivo.
          </p>
        </BackgroundText>
      </BackgroundSection>

      {/* Eventos */}
      <EventSection>
        <EventTitle>
          <span className="bold">Eventos </span>
          <span className="normal">en el Huila</span>
        </EventTitle>
        <EventSubtitle>No te pierdas los próximos eventos</EventSubtitle>
      </EventSection>

      <EventsGrid>
        {eventos.map((evento) => (
          <FlipCard key={evento.id} evento={evento} />
        ))}
      </EventsGrid>
    </Container>
  );
}

// Componente FlipCard
function FlipCard({ evento }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <FlipCardWrapper onClick={() => setFlipped(!flipped)}>
      <FlipCardInner flipped={flipped}>
        <FlipCardFront>
          <img src={evento.image} alt={evento.title} />
        </FlipCardFront>
        <FlipCardBack>
          <h3>{evento.title}</h3>
          <p>{evento.place}</p>
          <p>{evento.date}</p>
          <p className="description">{evento.description}</p>
        </FlipCardBack>
      </FlipCardInner>
    </FlipCardWrapper>
  );
}

// Styled Components
const Container = styled.div`
  width: 100%;
  background-color: #fff;
  overflow-x: hidden;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 0 20px;
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  background-color: #008073;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background-color: #006b5f;
  }

  &.left {
    left: 35px;
  }

  &.right {
    right: 35px;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  gap: 10px;
`;

const Dot = styled.div`
  width: ${props => props.active ? "12px" : "10px"};
  height: ${props => props.active ? "12px" : "10px"};
  border-radius: 50%;
  background-color: ${props => props.active ? "#008073" : "#ccc"};
  transition: all 0.3s;
`;

const ExploreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentLeft = styled.div`
  flex: 1;
`;

const TextContainer = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #008073;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #444;
  text-align: justify;
  line-height: 1.6;
`;

const MapButton = styled.button`
  background-color: #008073;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #006b5f;
  }
`;

const CiclaImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  flex-shrink: 0;
`;

const GreenSection = styled.div`
  background-color: #008073;
  padding: 30px 20px;
  margin-top: 25px;
  text-align: center;
`;

const SectionSubtitle = styled.p`
  font-size: 10px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
`;

const ChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  color: #008073;
  border: none;
  border-radius: 15px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #008073;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const EventSection = styled.div`
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 0 20px;
`;

const EventTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 5px;

  .bold {
    font-weight: 700;
    color: #008073;
  }

  .normal {
    font-weight: 400;
    color: #008073;
  }
`;

const EventSubtitle = styled.p`
  font-size: 14px;
  color: #444;
`;

const SitioRow = styled.div`
  display: flex;
  flex-direction: ${props => props.reverse ? "row-reverse" : "row"};
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SitioImage = styled.img`
  width: 48%;
  height: 160px;
  border-radius: 10px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SitioTextContainer = styled.div`
  width: 48%;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.reverse ? "flex-end" : "flex-start"};

  @media (max-width: 768px) {
    width: 100%;
    align-items: flex-start;
  }
`;

const SitioName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SitioLocation = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
`;

const ExploreButton = styled.button`
  background-color: #00B89C;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #009680;
  }
`;

const ToggleButton = styled.button`
  background-color: #2C786C;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  display: block;
  margin: 20px auto;
  width: 70%;
  max-width: 300px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #235e54;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: white;
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: #000;
`;

const InfoContainer = styled.div`
  padding: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #00B89C;
  margin-bottom: 5px;
`;

const ModalUbicacion = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
`;

const ModalDescripcion = styled.p`
  font-size: 15px;
  color: #444;
  line-height: 1.6;
  text-align: justify;
`;

const CloseButton = styled.button`
  background-color: #2C786C;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  width: calc(100% - 40px);
  margin: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #235e54;
  }
`;

const BackgroundSection = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  margin: 40px 0;
  background-image: url('https://picsum.photos/1200/400?random=20');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
`;

const BackgroundText = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 20px;

  h2 {
    color: white;
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    color: #E8F6F3;
    font-size: 16px;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FlipCardWrapper = styled.div`
  perspective: 1000px;
  cursor: pointer;
  height: 200px;
`;

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const FlipCardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FlipCardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background-color: #2C786C;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  p {
    font-size: 12px;
    color: #E8F6F3;
    margin: 3px 0;
  }

  .description {
    font-size: 11px;
    margin-top: 8px;
    line-height: 1.4;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const SocialIcon = styled.a`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E8F6F3;
  transition: all 0.3s;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }
`;