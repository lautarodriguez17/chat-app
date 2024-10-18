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

  return (
    <div className="chat-container">
      <h2>Chat en Vivo</h2>
      <div className="chat-box">
        {chat.map((item, index) => (
          <p key={index}>
            {item.type === "message"
              ? `Mensaje: ${item.content}`
              : `Archivo enviado: ${item.content}`}
          </p>
        ))}
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
    </div>
  );
};

export default Chat;
