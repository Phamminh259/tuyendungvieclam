import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Avatar, message, Spin, notification } from 'antd';
import { SendOutlined, UserOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { getRoomMessages, markMessagesAsRead } from '../../../api/chatApi';
import WebSocketService from '../../../services/websocket';
import notificationSound from '../../../assets/music/level-up.mp3';
import '../../../styles/ChatRoom.css';

const ChatRoom = ({ roomId, currentUser, otherUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesContainerRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    initializeChat();
    return () => cleanup();
  }, [roomId]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const initializeChat = async () => {
    try {
      await loadMessages();
      await connectWebSocket();
      setIsConnected(true);
    } catch (error) {
      console.error('Error initializing chat:', error);
      message.error('Không thể kết nối chat');
      setIsConnected(false);
    }
  };

  const cleanup = () => {
    try {
      WebSocketService.disconnect();
      setIsConnected(false);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  const connectWebSocket = async () => {
    try {
      const client = await WebSocketService.connect();
      
      const subscription = await WebSocketService.subscribe(
        `/topic/chat/${roomId}`,
        (messageEvent) => {
          try {
            if (messageEvent && messageEvent.body) {
              console.log('Received WebSocket message:', messageEvent.body);
              const newMessage = JSON.parse(messageEvent.body);
              if (newMessage) {
                handleNewMessage(newMessage);
                
                if (newMessage.senderId !== currentUser.id) {
                  markMessagesAsRead(roomId, currentUser.id).catch(error => {
                    console.error('Error marking messages as read:', error);
                  });
                }
              }
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        }
      );

      stompClientRef.current = subscription;
      setIsConnected(true);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      throw error;
    }
  };

  const handleNewMessage = (newMessage) => {
    console.log('Processing new message:', newMessage);
    
    if (!newMessage || !newMessage.content) return;

    setMessages(prev => {
      const isDuplicate = prev.some(msg => {
        if (msg.id && newMessage.id) {
          return msg.id === newMessage.id;
        }
        
        const timeDiff = Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp));
        return msg.content === newMessage.content && 
               msg.senderId === newMessage.senderId && 
               timeDiff < 1000;
      });

      if (isDuplicate) {
        console.log('Duplicate message detected, skipping');
        return prev;
      }

      if (newMessage.senderId !== currentUser.id) {
        notification.info({
          message: `${otherUser?.name || 'Người dùng'} đã gửi tin nhắn mới`,
          description: newMessage.content,
          icon: <MessageOutlined style={{ color: '#1890ff' }} />,
          placement: 'topRight',
          duration: 3,
          onClick: () => {
            scrollToBottom();
          }
        });

        try {
          const audio = new Audio(notificationSound);
          audio.play();
        } catch (error) {
          console.error('Error playing notification sound:', error);
        }
      }

      console.log('Adding new message to state');
      return [...prev, newMessage];
    });

    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !isConnected) return;

    try {
      const messageContent = inputValue.trim();
      setInputValue('');

      const newMessage = {
        content: messageContent,
        senderId: currentUser.id,
        senderType: currentUser.type,
        roomId: roomId,
        timestamp: new Date().toISOString()
      };

      await WebSocketService.sendMessage('/app/chat.send/' + roomId, newMessage);
      
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Không thể gửi tin nhắn');
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getRoomMessages(roomId);
      
      if (Array.isArray(data)) {
        const sortedMessages = data.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        setMessages(prevMessages => {
          const newMessages = sortedMessages.filter(newMsg => 
            !prevMessages.some(prevMsg => 
              prevMsg.id === newMsg.id || 
              (prevMsg.content === newMsg.content && 
               prevMsg.senderId === newMsg.senderId &&
               Math.abs(new Date(prevMsg.timestamp) - new Date(newMsg.timestamp)) < 1000)
            )
          );
          
          return [...prevMessages, ...newMessages];
        });
      }
      
      if (currentUser?.id) {
        await markMessagesAsRead(roomId, currentUser.id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        loadMessages();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected, roomId]);

  return (
    <div className="chat-window">
      <Card 
        className="chat-card"
        title={
          <div className="chat-header">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} src={otherUser?.avatar} />
              <div className="user-details">
                <span className="user-name">{otherUser?.name || 'User'}</span>
                <span className={`connection-status ${isConnected ? 'online' : ''}`}>
                  {isConnected ? 'Online' : 'Connecting...'}
                </span>
              </div>
            </div>
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
          </div>
        }
        bordered={false}
      >
        <div 
          className="chat-content" 
          ref={messagesContainerRef}
          style={{ 
            height: '400px',
            overflowY: 'auto'
          }}
        >
          {loading ? (
            <div className="loading-container">
              <Spin />
            </div>
          ) : (
            <div className="messages-wrapper">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    {msg.content}
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={el => el && el.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          )}
        </div>

        <div className="chat-input">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onPressEnter={handleSend}
            placeholder="Nhập tin nhắn..."
            disabled={!isConnected || loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!isConnected || loading}
          />
        </div>
      </Card>
    </div>
  );
};

export default ChatRoom; 