import React, { useState } from 'react';
import { Send, MessageCircle, X, MinusCircle } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isBot: false }]);
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Thanks for your message. Our team will get back to you soon.", 
          isBot: true 
        }]);
      }, 1000);
      setInput('');
    }
  };

  const chatbotStyle = {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    width: isOpen ? '300px' : 'auto',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    height: isOpen ? (isMinimized ? '50px' : '400px') : 'auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  };

  const messageContainerStyle = {
    height: '300px',
    overflowY: 'auto',
    backgroundColor: '#1E1E1E',
  };

  // Chat icon button when closed
  if (!isOpen) {
    return (
      <button 
        className="btn btn-primary rounded-circle p-3 position-fixed"
        style={{ right: '20px', bottom: '20px', width: '60px', height: '60px' }}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div style={chatbotStyle} className="card">
      {/* Header */}
      <div className="card-header bg-primary d-flex justify-content-between align-items-center py-2">
        <div className="d-flex align-items-center">
          <span className="badge bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></span>
          <h6 className="mb-0 text-white">Support Chat</h6>
        </div>
        <div>
          <button 
            className="btn btn-link btn-sm text-white p-0 me-2"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <MinusCircle size={16} />
          </button>
          <button 
            className="btn btn-link btn-sm text-white p-0"
            onClick={() => setIsOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="card-body p-3" style={messageContainerStyle}>
            {messages.map((message, index) => (
              <div key={index} className={`d-flex mb-3 ${message.isBot ? 'justify-content-start' : 'justify-content-end'}`}>
                <div className={`p-2 rounded ${
                  message.isBot 
                    ? 'bg-dark text-white' 
                    : 'bg-primary text-white'
                }`} style={{ maxWidth: '80%' }}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="card-footer bg-dark border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-dark text-white border-dark"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
              />
              <button
                className="btn btn-primary"
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;