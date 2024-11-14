import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { AiOutlinePaperClip, AiOutlineSend, AiOutlineAudio } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';

const sendToBackend = async (message, file) => {
  const url = "/chat";
  const sessionID = sessionStorage.getItem('sessionID');

  if (message) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message, sessionID: sessionID }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar mensaje al backend");
      }

      const data = await response.json();

      if (data.sessionID) {
        sessionStorage.setItem('sessionID', data.sessionID);
      }

      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy tu chatbot profesional, ¿en qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() || selectedFile) {
      const userMessage = { sender: 'user', text: input, file: selectedFile ? selectedFile.name : null };
      setMessages([...messages, userMessage]);
      setInput('');
      setSelectedFile(null);

      const responseData = await sendToBackend(input, null);
      if (responseData) {
        const botMessage = {
          sender: 'bot',
          renderFlag: responseData.render_flag,
          renderType: responseData.render_type,
          content: responseData.response
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const renderBotResponse = (msg) => {
    if (msg.renderFlag && msg.renderType === 'simulacion_prestamo') {
      return (
        <div style={styles.simulationContainer}>
          <div style={styles.simulationIcon}>💵</div>
          <h4 style={styles.simulationTitle}>{msg.content.title}</h4>
          <p style={styles.simulationAmount}>Hasta <span style={styles.simulationCurrency}>S/</span> {msg.content.amount}</p>
          <div style={styles.simulationTEA}>{msg.content.tea}</div>
        </div>
      );
    }
    return <p>{msg.content}</p>;
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={{ 
              ...styles.messageWrapper, 
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
            }}
          >
            {msg.sender === 'bot' && (
              <div style={styles.userIcon}>
                <FiUser style={styles.icon} />
              </div>
            )}
            <div style={{ 
              ...styles.messageBubble, 
              backgroundColor: msg.sender === 'user' ? '#4CAF50' : '#fff', 
              color: msg.sender === 'user' ? '#fff' : '#000',
            }}>
              {msg.sender === 'bot' ? renderBotResponse(msg) : msg.text}
              {msg.file && (
                <div style={styles.fileMessage}>
                  📎 Archivo: {msg.file}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <button style={styles.iconButton}>
          <AiOutlineAudio />
        </button>
        <label htmlFor="file-input" style={styles.iconButton}>
          <AiOutlinePaperClip />
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </label>
        <div style={styles.inputWrapper}>
          {selectedFile ? (
            <div style={styles.filePreviewContainer}>
              <span style={styles.filePreview}>📎 {selectedFile.name}</span>
              <MdClose 
                style={styles.closeIcon} 
                onClick={() => setSelectedFile(null)} 
              />
            </div>
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
              placeholder="Escribe tu mensaje"
              style={styles.input}
            />
          )}
        </div>
        <button onClick={handleSend} style={styles.iconButtonEnter} disabled={loading}>
          <AiOutlineSend />
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    background: '#a9a74f1a',
    margin: 'auto',
    padding: '50px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
  },
  messageContainer: {
    padding: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  messageBubble: {
    padding: '10px 15px',
    borderRadius: '15px',
    fontSize: '14px',
    maxWidth: '70%',
  },
  userIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
  },
  icon: {
    fontSize: '18px',
  },
  fileMessage: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#555',
  },
  filePreviewContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: '#f0f0f0',
    borderRadius: '15px',
    padding: '5px 10px',
    maxWidth: '100%',
  },
  filePreview: {
    fontSize: '14px',
    color: '#555',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  closeIcon: {
    fontSize: '18px',
    color: '#888',
    cursor: 'pointer',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '20px',
    padding: '5px 10px',
    backgroundColor: '#fff',
    gap: '5px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#4CAF50',
    display: 'flex',
    alignItems: 'center',
  },
  iconButtonEnter: {
    background: '#4CAF50',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  fileInput: {
    display: 'none',
  },
  // Estilos para la respuesta de simulación de préstamo
  simulationContainer: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  simulationIcon: {
    fontSize: '24px',
  },
  simulationTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  simulationAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: '5px',
  },
  simulationCurrency: {
    fontSize: '16px',
  },
  simulationTEA: {
    marginTop: '10px',
    backgroundColor: '#eee',
    padding: '5px',
    borderRadius: '5px',
    fontSize: '12px',
    color: '#555',
  },
};

export default Chat;