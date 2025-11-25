// src/components/Chatbot.jsx
const Chatbot = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/10/15/18/20251015185823-9W17IZJI.json"
        title="Huilapp Chatbot"
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="microphone; clipboard-read; clipboard-write"
      />
    </div>
  );
};

export default Chatbot;
