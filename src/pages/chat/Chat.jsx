import React from "react";
import styled from "styled-components";

function Chat() {
  return (
    <ChatContainer>

      <ChatFrameWrapper>
        <ChatIframe
          src="https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/10/15/18/20251015185823-9W17IZJI.json"
          title="Huilapp Chatbot"
          allow="microphone; clipboard-read; clipboard-write"
        />
      </ChatFrameWrapper>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: #f9f9f9;
  color: #333;
  font-family: "Poppins", sans-serif;
  padding-top: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #d60000;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

// 🔹 Contenedor para que el iframe no se desborde
const ChatFrameWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  height: 80vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
`;

// 🔹 Iframe del chatbot
const ChatIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export default Chat;

