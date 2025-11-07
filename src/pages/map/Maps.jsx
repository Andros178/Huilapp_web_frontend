import React from "react";
import styled from "styled-components";

function Maps() {
  return (
    <MapsContainer>
      <Title>Página de mapa</Title>
    </MapsContainer>
  );
}

const MapsContainer = styled.div`
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

export default Maps;
