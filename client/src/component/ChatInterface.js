import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

function ChatInterface() {
  const [history, setHistory] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState(''); // To store the edited message
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [history]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditedMessage(message.content); // Set the content for editing
    if (message.sender === 'server') {
      copyResponseData(message.content);
    }
  };

  const handleCancelEditing = () => {
    setEditingMessageId(null);
    setEditedMessage(''); // Reset the edited message
  };

  const copyResponseData = (data) => {
    const textarea = document.createElement('textarea');
    textarea.value = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const handleSaveEditedMessage = () => {
    // Find and update the edited message in the history
    const updatedHistory = history.map((message) =>
      message.id === editingMessageId
        ? { ...message, content: editedMessage }
        : message
    );

    setHistory(updatedHistory);
    setEditingMessageId(null); // Reset editing state
    setEditedMessage(''); // Reset the edited message
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert(inputValue);
    if (inputValue.trim() !== '') {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:3002/chat', { prompt: inputValue });
        const newMessage = { content: inputValue, sender: 'user', id: Date.now() };
        const newResponse = { content: response.data, sender: 'server', id: Date.now() + 1 };

        setHistory((prevHistory) => [...prevHistory, newMessage, newResponse]);
        setQuestions((prevQuestions) => [inputValue, ...prevQuestions]);

        setInputValue('');
        setError('');
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data);
          setLoading(false);
        } else {
          setError('An error occurred while making the request.');
          setLoading(false);
        }
      }
    }
  }

 

  const handleDeleteHistory = () => {
    setHistory([]);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='d-flex'>
      <div className='position-absolute sidebar ms-3 mt-2' onClick={handleToggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layout-sidebar" viewBox="0 0 16 16">
          <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H5zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2V2z" />
        </svg>
      </div>

      <div className={`w-25 p-3 bg-dark text-light ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className='new-chat d-flex gap-2'>
          <button onClick={handleDeleteHistory} className='newchat-btn bg-dark text-light '>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            New Chat
          </button>

          <div className='sidebar' onClick={handleToggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-layout-sidebar" viewBox="0 0 16 16">
              <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H5zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2V2z" />
            </svg>
          </div>
        </div>

        <div className='question pt-3'>
          {
            questions.map((item) => {
              return (
                <div className='n bg-dark text-light border-light border-2px'>{item}</div>
              )
            })
          }
        </div>
      </div>

      <div className="container chat-interface">
        <div className="chat-container" ref={chatContainerRef}>
          {history.length === 0 ? (
            <div className="empty-history mb-5">No chat history</div>
          ) : (
            history.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {editingMessageId === message.id ? (
                  <input
                    type="text"
                    className="edited-message-input"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                  />
                ) : (
                  <span className="message-content">{message.content}</span>
                )}
                {message.sender === 'server' && (
                  <button
                    className="copy-response"
                    onClick={() => copyResponseData(message.content)}
                    title="Copy Response"
                  >
                    &#128203;
                  </button>
                )}
                {message.sender === 'user' && (
                  <button
                    className="edit-message"
                    onClick={() => handleEditMessage(message)}
                    title="Edit Message"
                  >
                    &#9998;
                  </button>
                )}
                {editingMessageId === message.id && (
                  <button
                    className="save-edited-message"
                    onClick={handleSubmit}
                    title="Save Edited Message"
                  >
                    &#128190;
                  </button>
                )}
                {editingMessageId === message.id && (
                  <button
                    className="cancel-editing"
                    onClick={handleCancelEditing}
                    title="Cancel Editing"
                  >
                    &#10006;
                  </button>
                )}
              </div>
            ))
          )}
          {loading && <p style={{ marginBottom: "100px" }}>Loading...</p>}
        </div>

        <form onSubmit={handleSubmit} className="input-form mb-2 mt-5  ">
          <input
            type="text"
            className="input-field shadow-lg"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Send a message."
          />
          <button type="submit" className="send-button shadow-lg mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d9d9e3" class="bi bi-send-fill" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
            </svg>
          </button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
      
    </div>
  );
}

export default ChatInterface;
