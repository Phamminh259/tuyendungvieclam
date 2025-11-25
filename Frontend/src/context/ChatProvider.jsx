import React, { createContext, useState, useContext } from 'react';
import ChatBot from '../components/common/ChatBot/ChatBot.jsx';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const addMessage = (message) => {
    console.log('Adding message:', message); // Debug log
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const value = {
    isChatOpen,
    toggleChat,
    messages,
    addMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatBot 
        isOpen={isChatOpen} 
        onToggle={toggleChat}
        messages={messages}
        onAddMessage={addMessage}
      />
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 