import React from "react";
import styled from "styled-components";

function Profile() {
  return (
    <ProfileContainer>
      <Title>Página de perfil</Title>
    </ProfileContainer>
  );
}

const ProfileContainer = styled.div`
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

export default Profile;
