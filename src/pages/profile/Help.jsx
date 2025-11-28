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
  {
    question: "¿Cómo cambio mi contraseña?",
    answer:
      "En la sección de Seguridad puedes modificar tu contraseña actual fácilmente.",
  },
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
];

const Help = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <Wrapper>
      <Card>
        <Header>
          <HeaderTitle>Ayuda y soporte</HeaderTitle>
        </Header>

        <SectionTitle>Preguntas frecuentes</SectionTitle>

        <FAQGrid>
          {faqs.map((item, index) => (
            <FAQBlock key={index}>
              <FAQToggle
                role="button"
                tabIndex={0}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
                onClick={() => toggle(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(index);
                  }
                }}
              >
                <FAQQuestion>{item.question}</FAQQuestion>
                <IconWrap aria-hidden>
                  {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                </IconWrap>
              </FAQToggle>

              <FAQContent id={`faq-${index}`} data-open={openIndex === index}>
                <p>{item.answer}</p>
              </FAQContent>
            </FAQBlock>
          ))}
        </FAQGrid>

        <SectionTitle style={{ marginTop: "38px" }}>Contáctanos</SectionTitle>

        <ContactGrid>
          <ContactLink href="mailto:soporte@HuilApp.com">
            <FiMail />
            <ContactText>soporte@HuilApp.com</ContactText>
          </ContactLink>

          <ContactLink href="tel:+573006106726">
            <FiPhone />
            <ContactText>+57 300 610 6726</ContactText>
          </ContactLink>

          <ContactLink as="div" role="article" aria-label="Dirección">
            <IoLocationOutline />
            <ContactText>Calle 10 #15-20, Neiva, Huila</ContactText>
          </ContactLink>

          <ContactLink href="https://instagram.com" target="_blank" rel="noreferrer">
            <IoLogoInstagram />
            <ContactText>@HuilApp</ContactText>
          </ContactLink>

          <ContactLink href="https://facebook.com" target="_blank" rel="noreferrer">
            <IoLogoFacebook />
            <ContactText>facebook.com/HuilApp</ContactText>
          </ContactLink>

          <ContactLink href="https://www.HuilApp.com" target="_blank" rel="noreferrer">
            <FiGlobe />
            <ContactText>www.HuilApp.com</ContactText>
          </ContactLink>
        </ContactGrid>
      </Card>
    </Wrapper>
  );
};

export default Help;

/* ------------------- STYLED (VERSIÓN MEJORADA) ----------------------- */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 60px 24px;

  @media (max-width: 720px) {
    padding: 35px 14px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.07);

  @media (max-width: 900px) {
    padding: 36px;
    border-radius: 22px;
  }

  @media (max-width: 720px) {
    padding: 24px 18px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderTitle = styled.h1`
  text-align: center;
  font-size: 32px;
  color: #00665a;
  font-weight: 800;
  letter-spacing: -0.5px;

  @media (max-width: 720px) {
    font-size: 26px;
  }

  @media (max-width: 390px) {
    font-size: 22px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #008c7a;
  margin: 26px 0 20px;
  padding-left: 4px;

  @media (max-width: 720px) {
    font-size: 19px;
  }

  @media (max-width: 390px) {
    font-size: 17px;
  }
`;

const FAQBlock = styled.div`
  margin-bottom: 12px;
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 4px;
  transition: all 240ms ease;
  cursor: pointer;

  &:hover {
    background: #f7fdfb;
  }
`;

const FAQToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-radius: 12px;

  &:focus {
    outline: 3px solid rgba(0, 159, 139, 0.12);
  }
`;

const FAQGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 900px) {
    gap: 18px;
  }
`;

const FAQQuestion = styled.p`
  flex: 1;
  margin-right: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const FAQContent = styled.div`
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0 14px;
  border-left: 3px solid #009f8b22;
  margin-left: 8px;
  background: #f2fbf8;
  border-radius: 10px;
  transition: all 300ms ease;

  &[data-open='true'] {
    max-height: 240px;
    opacity: 1;
    padding: 14px 14px;
    margin-top: 8px;
  }

  p {
    font-size: 15px;
    color: #444;
    line-height: 1.48;
  }
`;

const Divider = styled.div`
  height: 1px;
  margin-top: 10px;
  background: #ececec;
`;

const IconWrap = styled.span`
  display: flex;
  align-items: center;

  svg {
    font-size: 20px;
    color: #009f8b;
    transition: transform 180ms ease;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  margin-top: 14px;

  @media (max-width: 390px) {
    grid-template-columns: 1fr;
  }
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e8f3f1;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  transition: all 180ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.09);
    background: #f7fdfb;
  }

  &:focus {
    outline: 3px solid rgba(0, 159, 139, 0.12);
  }

  svg {
    font-size: 25px;
    color: #009f8b;
  }
`;

const ContactText = styled.span`
  font-size: 15px;
  color: #1f2a29;
  font-weight: 600;
  letter-spacing: -0.2px;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;
