// Help.jsx — Versión FULL Responsive Optimizada

import { useState } from "react";
import styled from "styled-components";
import {
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiGlobe,
} from "react-icons/fi";
import {
  IoLocationOutline,
  IoLogoInstagram,
  IoLogoFacebook,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cómo puedo actualizar mi perfil?",
      answer:
        "Ve a tu perfil y selecciona la opción 'Editar perfil' para cambiar tus datos personales.",
    },
    {
      question: "¿Cómo cambio mi contraseña?",
      answer:
        "En la sección de Seguridad puedes modificar tu contraseña actual fácilmente.",
    },
    {
      question: "¿Dónde puedo ver mis datos guardados?",
      answer: "Toda tu información está disponible en la sección de Perfil.",
    },
    {
      question: "¿Cómo puedo contactar al soporte técnico?",
      answer:
        "Puedes comunicarte con nuestro equipo de soporte a través del correo soporte@HuilApp.com.",
    },
    {
      question: "¿Qué hago si la aplicación presenta fallos?",
      answer:
        "Si notas un problema, intenta actualizar la página. Si persiste, comunícate con soporte.",
    },
  ];

  return (
    <Wrapper>
      <Card>
        <Header>
          <BackButton onClick={() => navigate("/profile")}>←</BackButton>
          <HeaderTitle>Ayuda y soporte</HeaderTitle>
        </Header>

        <SectionTitle>Preguntas frecuentes</SectionTitle>

        {faqs.map((item, index) => (
          <FAQBlock key={index}>
            <FAQItem onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <FAQQuestion>{item.question}</FAQQuestion>
              {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
            </FAQItem>

            <FAQContent $open={openIndex === index}>
              <p>{item.answer}</p>
            </FAQContent>

            {index !== faqs.length - 1 && <Divider />}
          </FAQBlock>
        ))}

        <SectionTitle style={{ marginTop: "45px" }}>Contáctanos</SectionTitle>

        <ContactGrid>
          <ContactItem onClick={() => window.open("mailto:soporte@HuilApp.com")}>
            <FiMail />
            <ContactText>soporte@HuilApp.com</ContactText>
          </ContactItem>

          <ContactItem onClick={() => window.open("tel:+573006106726")}>
            <FiPhone />
            <ContactText>+57 300 610 6726</ContactText>
          </ContactItem>

          <ContactItem>
            <IoLocationOutline />
            <ContactText>Calle 10 #15-20, Neiva, Huila</ContactText>
          </ContactItem>

          <ContactItem onClick={() => window.open("https://instagram.com")}>
            <IoLogoInstagram />
            <ContactText>@HuilApp</ContactText>
          </ContactItem>

          <ContactItem onClick={() => window.open("https://facebook.com")}>
            <IoLogoFacebook />
            <ContactText>facebook.com/HuilApp</ContactText>
          </ContactItem>

          <ContactItem onClick={() => window.open("https://www.HuilApp.com")}>
            <FiGlobe />
            <ContactText>www.HuilApp.com</ContactText>
          </ContactItem>
        </ContactGrid>
      </Card>
    </Wrapper>
  );
};

export default Help;

/* ------------------- STYLED ----------------------- */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 50px 20px;

  @media (max-width: 720px) {
    padding: 35px 10px;
    width: 85%;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 850px;
  background: white;
  padding: 50px;
  border-radius: 22px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.07);

  @media (max-width: 900px) {
    padding: 40px;
  }

  @media (max-width: 720px) {
    padding: 28px 20px;
    border-radius: 18px;
  }

  @media (max-width: 390px) {
    padding: 20px 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  background: #e2f7f3;
  padding: 12px 15px;
  border-radius: 14px;
  font-size: 18px;
  border: none;

  @media (max-width: 390px) {
    padding: 10px 12px;
  }
`;

const HeaderTitle = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 28px;
  color: #00665a;
  font-weight: 800;

  @media (max-width: 720px) {
    font-size: 22px;
  }

  @media (max-width: 390px) {
    font-size: 19px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #008c7a;
  margin: 30px 0 18px;

  @media (max-width: 720px) {
    font-size: 21px;
  }

  @media (max-width: 390px) {
    font-size: 18px;
  }
`;

const FAQBlock = styled.div`
  margin: 5px 0;
`;

const FAQItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 600;
  padding: 16px 0;

  @media (max-width: 720px) {
    font-size: 15px;
  }

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

const FAQQuestion = styled.p`
  flex: 1;
  margin-right: 10px;
  color: #333;
`;

const FAQContent = styled.div`
  max-height: ${(p) => (p.$open ? "300px" : "0px")};
  overflow: hidden;
  padding: ${(p) => (p.$open ? "12px 12px" : "0 12px")};
  margin: ${(p) => (p.$open ? "5px 0 15px" : "0")};
  background: #f2fbf8;
  border-radius: 10px;

  p {
    font-size: 15px;
    color: #444;
    margin: 0;
  }

  @media (max-width: 720px) {
    p {
      font-size: 14px;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e5e5;
`;

const ContactGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

  @media (max-width: 390px) {
    grid-template-columns: 1fr;
  }
`;

const ContactItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fefc;
  border: none;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  svg {
    font-size: 22px;
    color: #009f8b;
  }

  @media (max-width: 720px) {
    padding: 14px;
  }
`;

const ContactText = styled.span`
  font-size: 15px;
  color: #1f2a29;
  font-weight: 600;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;
