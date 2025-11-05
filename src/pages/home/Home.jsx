// src/pages/Home.jsx
import React from "react";
import styled from "styled-components";

// 🔹 Contenedor principal
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9f9f9;
  color: #333;
  font-family: "Poppins", sans-serif;
`;

// 🔹 Título principal
const Title = styled.h2`
  font-size: 2rem;
  color: #d60000;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

// 🔹 Párrafo descriptivo
const Description = styled.p`
  font-size: 1.2rem;
  color: #555;
  background-color: #fff;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

function Home() {
  return (
    <HomeContainer>
      <Title>Página principal</Title>
      <Description>Bienvenido a Huilapp Web 🌿</Description>
    </HomeContainer>
  );
}

export default Home;
