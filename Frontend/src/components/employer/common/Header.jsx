import React, { useContext, useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Button, Space, Avatar, Badge, message, Modal, notification } from 'antd';
import { 
  MessageOutlined, 
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../components/auth/AuthProvider';
import ChatRoom from '../../common/ChatRoom/ChatRoom';
import logo from '../../../assets/logos/logo.png';
import WebSocketService from '../../../services/websocket';
import { API_URL } from '../../../utils/config';

const { Header } = Layout;
const { confirm } = Modal;

const HeaderComponent = () => {
  const { isAuthenticated, user, logout, accountType } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [currentChatRoom, setCurrentChatRoom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Đặt biến employer lên trước useEffect
  const employerUser = localStorage.getItem('employer_user');
  const employer = employerUser ? JSON.parse(employerUser) : null;
  const employerToken = localStorage.getItem('employer_token');
  const employerType = localStorage.getItem('employer_type');

  // Kiểm tra cụ thể cho employer
  const shouldShowEmployerInfo = employerToken && employerUser && employerType === 'employer';

  useEffect(() => {
    if (shouldShowEmployerInfo) {
      loadChatRooms();
      startUnreadCountPolling();

      // Lắng nghe sự kiện tạo room mới
      const handleNewChatRoom = (event) => {
        const newRoom = event.detail;
        setChatRooms(prev => [...prev, newRoom]);
        setCurrentChatRoom(newRoom);
        setIsChatOpen(true);
      };

      window.addEventListener('openChatRoom', handleNewChatRoom);

      return () => {
        window.removeEventListener('openChatRoom', handleNewChatRoom);
      };
    }
  }, [shouldShowEmployerInfo]);

  useEffect(() => {
    if (employer?.id) {
      const connectWebSocket = async () => {
        try {
          await WebSocketService.connect();
          
          await WebSocketService.subscribe(
            `/user/${employer.id}/queue/messages`,
            handleNewMessage
          );

          await WebSocketService.subscribe(
            `/user/${employer.id}/queue/unread`,
            handleUnreadUpdate
          );

          setIsConnected(true);
          console.log('WebSocket connected successfully');
        } catch (error) {
          console.error('WebSocket connection error:', error);
          setIsConnected(false);
        }
      };

      connectWebSocket();
      loadUnreadCount();

      return () => {
        WebSocketService.disconnect();
      };
    }
  }, [employer]);

  const loadChatRooms = async () => {
    try {
      const employer = JSON.parse(employerUser);
      const response = await fetch(`${API_URL}/chatroom/list/${employer.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${employerToken}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setChatRooms(data);
      } else {
        console.error('Invalid chat rooms data:', data);
        setChatRooms([]);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      setChatRooms([]);
      
      message.error('Không thể tải danh sách chat');
    }
  };

  const startUnreadCountPolling = () => {
    const employer = JSON.parse(employerUser);
    const interval = setInterval(async () => {
      try {
        let totalUnread = 0;
        for (const room of chatRooms) {
          const response = await fetch(`${API_URL}/chatroom/unread-count/${employer.id}`);
          const count = await response.json();
          totalUnread += count;
        }
        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  };

  const handleLogout = async () => {
    try {
      await logout('employer');
      navigate('/login-employer');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChatClick = () => {
    if (!shouldShowEmployerInfo) {
      message.warning('Vui lòng đăng nhập để sử dụng chat');
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  const handleChatRoomSelect = (room) => {
    setCurrentChatRoom(room);
    setIsChatOpen(true);
    
    // Đánh dấu tin nhắn đã đọc
    const employer = JSON.parse(employerUser);
    fetch(`${API_URL}/chatroom/messages/read?roomId=${room.roomId}&userId=${employer.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${employerToken}`
      }
    }).catch(error => {
      console.error('Error marking messages as read:', error);
    });
  };

  const handleDeleteChatRoom = async (roomId, e) => {
    e.stopPropagation(); // Ngăn event click lan ra Menu.Item

    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      
      onOk: async () => {
        try {
          // Kiểm tra token
          if (!employerToken) {
            message.error('Vui lòng đăng nhập lại');
            return;
          }

          const response = await fetch(`${API_URL}/chatroom/delete/${roomId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${employerToken}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error('Server error:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          message.success('Đã xóa cuộc trò chuyện');
          
          // Cập nhật lại danh sách chat
          await loadChatRooms();
          
          // Nếu đang mở chat room này thì đóng lại
          if (currentChatRoom?.roomId === roomId) {
            setCurrentChatRoom(null);
            setIsChatOpen(false);
          }
        } catch (error) {
          console.error('Error deleting chat room:', error);
          message.error('Không thể xóa cuộc trò chuyện. Vui lòng thử lại sau.');
        }
      },
      onCancel() {
        console.log('Cancel delete');
      },
    });
  };

  const handleNewMessage = (message) => {
    try {
      const messageData = JSON.parse(message.body);
      console.log('Received new message:', messageData);
      
      // Cập nhật số tin nhắn chưa đọc ngay lập tức
      const employer = JSON.parse(employerUser);
      if (messageData.senderId !== employer.id) {
        setUnreadCount(prev => prev + 1);
        
        // Cập nhật unreadCount trong chatRooms
        setChatRooms(prevRooms => {
          return prevRooms.map(room => {
            if (room.roomId === messageData.roomId) {
              return {
                ...room,
                unreadCount: (room.unreadCount || 0) + 1
              };
            }
            return room;
          });
        });

        notification.info({
          message: 'Tin nhắn mới',
          description: messageData.content,
          placement: 'topRight',
          duration: 3
        });

        try {
          const audio = new Audio(notificationSound);
          audio.play();
        } catch (error) {
          console.error('Error playing notification sound:', error);
        }
      }
    } catch (error) {
      console.error('Error handling new message:', error);
    }
  };

  const handleUnreadUpdate = (message) => {
    try {
      const data = JSON.parse(message.body);
      console.log('Received unread update:', data);
      if (typeof data.count === 'number') {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error handling unread update:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch(
        `${API_URL}/chatroom/unread-count/${employer.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Menu cho danh sách phòng chat
  const chatMenu = (
    <Menu>
      {chatRooms.length > 0 ? (
        chatRooms.map(room => (
          <Menu.Item 
            key={room.roomId || `room-${room.candidateId}`}
          >
            <div className="chat-room-item">
              <div 
                className="chat-room-info"
                onClick={() => handleChatRoomSelect(room)}
              >
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} src={room.candidateAvatar} />
                  <span>{room.candidateName || 'Người dùng'}</span>
                  {room.unreadCount > 0 && (
                    <Badge count={room.unreadCount} size="small" />
                  )}
                </Space>
              </div>
              <DeleteOutlined
                className="delete-icon"
                onClick={(e) => handleDeleteChatRoom(room.roomId, e)}
              />
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item key="no-chat">
          Không có cuộc trò chuyện nào
        </Menu.Item>
      )}
    </Menu>
  );

  // Menu cho người dùng đã đăng nhập
  const userMenu = (
    <Menu>
      <Menu.Item key="dashboard" icon={<HomeOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="">Cài đặt tài khoản</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header 
      style={{ 
        backgroundColor: 'rgb(2, 0, 36)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div>
        <a href="/dashboard" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="CareerLink Logo" style={{ height: '40px' }} />
        </a>
      </div>

      <Space size="middle">
        <Dropdown overlay={chatMenu} placement="bottomRight" trigger={['click']}>
          <Badge count={unreadCount}>
            <Button 
              type="text" 
              icon={<MessageOutlined />}
              onClick={handleChatClick}
              style={{ color: 'white' }}
            >
              Tin nhắn
            </Button>
          </Badge>
        </Dropdown>

        {shouldShowEmployerInfo ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer', color: 'white' }}>
              <Avatar icon={<UserOutlined />} src={JSON.parse(employerUser)?.avatar} />
              <span>{JSON.parse(employerUser)?.email || 'Nhà tuyển dụng'}</span>
            </Space>
          </Dropdown>
        ) : (
          <Button type="default" href="/login-employer">
            Đăng ký / Đăng nhập
          </Button>
        )}
      </Space>

      {isChatOpen && currentChatRoom && (
        <ChatRoom
          roomId={currentChatRoom.roomId}
          currentUser={{
            id: JSON.parse(employerUser).id,
            type: 'EMPLOYER'
          }}
          otherUser={{
            id: currentChatRoom.candidateId,
            name: currentChatRoom.candidateName,
            avatar: currentChatRoom.candidateAvatar
          }}
          onClose={() => {
            setIsChatOpen(false);
            setCurrentChatRoom(null);
          }}
        />
      )}
    </Header>
  );
};

export default HeaderComponent;
