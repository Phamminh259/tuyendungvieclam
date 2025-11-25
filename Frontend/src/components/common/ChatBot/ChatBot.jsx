import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Tooltip, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import WebSocketService from '../../../services/websocketChatbot';
import '../../../styles/ChatBot.css';

const ChatBox = ({ isOpen, onToggle, messages, onAddMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);
  const [hasGreeted, setHasGreeted] = useState(() => {
    return localStorage.getItem('chatbot_greeted') === 'true'
  });
  const [lastMessageContent, setLastMessageContent] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (!hasGreeted) {
        handleGreeting();
      } else {
        connectWebSocket();
      }
    } else {
      cleanup();
    }
    
    return () => cleanup();
  }, [isOpen]);

  const cleanup = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    WebSocketService.disconnect();
    setLastMessageContent('');
    setLastMessageTime(null);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  };

  const renderMessageContent = (msg) => {
    if (msg.containsHtml) {
      return (
        <div 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: msg.content }}
          onClick={(e) => {
            // Xử lý click vào link
            if (e.target.tagName === 'A') {
              e.preventDefault();
              window.open(e.target.href, '_blank');
            }
          }}
        />
      );
    }
    return <div className="message-text">{msg.content}</div>;
  };

  const connectWebSocket = async () => {
    try {
      if (WebSocketService.isConnected()) {
        console.log('WebSocket already connected');
        return;
      }

      setIsConnecting(true);
      await WebSocketService.connect();
      
      if (!subscriptionRef.current) {
        subscriptionRef.current = await WebSocketService.subscribe('/topic/chatbot', (response) => {
          console.log('Received message:', response);
          const messageData = JSON.parse(response.body);
          console.log('Parsed message data:', messageData);
          
          if (messageData.type === 'BOT' || messageData.type === 'bot') {
            if (hasGreeted && messageData.content.includes("Xin chào! Tôi là trợ lý ảo")) {
              console.log('Skipping duplicate greeting message');
              return;
            }

            const currentTime = new Date().getTime();
            
            if (
              messageData.content === lastMessageContent && 
              lastMessageTime && 
              currentTime - lastMessageTime < 2000
            ) {
              console.log('Duplicate message detected, skipping...');
              return;
            }

            setLastMessageContent(messageData.content);
            setLastMessageTime(currentTime);

            onAddMessage({
              type: 'bot',
              content: messageData.content,
              timestamp: new Date(),
              containsHtml: messageData.containsHtml || false
            });
            setIsTyping(false);
          }
        });
      }
    } catch (error) {
      console.error('WebSocket connection error:', error);
      message.error('Không thể kết nối với chat server');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    try {
      const userMessage = {
        content: inputValue.trim(),
        type: 'USER',
        category: 'general'
      };

      // Add user message to chat
      onAddMessage({
        type: 'user',
        content: inputValue.trim(),
        timestamp: new Date()
      });

      // Clear input and show typing
      setInputValue('');
      setIsTyping(true);

      // Send message to server
      await WebSocketService.sendMessage('/app/chatbot.message', userMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Không thể gửi tin nhắn');
      setIsTyping(false);
    }
  };

  const handleGreeting = async () => {
    if (hasGreeted) return;
    
    try {
      await connectWebSocket();
      
      const userMessage = {
        content: "xin chào",
        type: 'USER',
        category: 'general'
      };

      await WebSocketService.sendMessage('/app/chatbot.message', userMessage);
      
      setHasGreeted(true);
      localStorage.setItem('chatbot_greeted', 'true');
    } catch (error) {
      console.error('Error sending greeting:', error);
    }
  };

  console.log('Current messages:', messages); // Debug log

  const handleToggle = () => {
    if (isOpen) {
      setHasGreeted(false);
      localStorage.removeItem('chatbot_greeted');
      cleanup();
    }
    onToggle();
  };

  return (
    <div className="chat-container">

      {isOpen && (
        <Card className="chat-box">
          <div className="chat-header">
            <RobotOutlined /> Chat Bot
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.type}`}>
                <div className="message-content">
                  <Avatar 
                    icon={msg.type === 'bot' ? <RobotOutlined /> : <UserOutlined />}
                    className="message-avatar"
                  />
                  <div className="message-bubble">
                    {renderMessageContent(msg)}
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>
          
          <div className="chat-input">
            <Input
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
              disabled={isConnecting}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={isConnecting}
            >
              Gửi
            </Button>
          </div>
        </Card>
      )}
      
      <div className="chatbot-button-wrapper">
        <Button
          className="chat-toggle-button"
          onClick={handleToggle}
          icon={
            isOpen ? (
              <CloseOutlined className="chat-icon" />
            ) : (
              <div className="robot-icon-wrapper">
                <RobotOutlined className="chat-icon" />
              </div>
            )
          }
        />
      </div>
      
    </div>
  );
};

export default ChatBox; 