import { useState } from "react";

// Simulación de backend ficticio
const sendToBackend = (message, file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mensaje enviado al backend:", message);
      if (file) {
        console.log("Archivo enviado al backend:", file.name);
      }
      resolve();
    }, 500);
  });
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [chat, setChat] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    await sendToBackend(message, null);
    setChat([...chat, { type: "message", content: message }]);
    setMessage("");
  };

  const sendFile = async (e) => {
    e.preventDefault();
    if (file) {
      await sendToBackend(null, file);
      setChat([...chat, { type: "file", content: file.name }]);
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Función para limpiar el historial del chat
  const clearChatHistory = () => {
    setChat([]); // Limpiar el historial de chat
  };

  return (
    <div className="chat-container">
      <h2>Chat en Vivo</h2>
      <div className="chat-box">
        {chat.length === 0 ? (
          <p>No hay mensajes.</p>
        ) : (
          chat.map((item, index) => (
            <p key={index}>
              {item.type === "message"
                ? `Mensaje: ${item.content}`
                : `Archivo enviado: ${item.content}`}
            </p>
          ))
        )}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
      <form onSubmit={sendFile}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Enviar Archivo</button>
      </form>
      <button onClick={clearChatHistory} className="clear-button">
        Limpiar Historial
      </button>
    </div>
  );
};

export default Chat;
