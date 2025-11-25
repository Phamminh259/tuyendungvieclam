import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Layout, Menu, Dropdown, Avatar, Button, message, Badge, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  BankOutlined,
  FileTextOutlined,
  MessageOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/logos/logo.png";
import { AuthContext } from "../../auth/AuthProvider";
import { getCandidateProfileByEmail } from '../../../api/candidateApi';
import { getChatRooms, getUnreadCount } from '../../../api/chatApi';
import ChatRoom from '../../common/ChatRoom/ChatRoom';
import WebSocketService from '../../../services/websocket';
import { API_URL } from '../../../utils/config';

const { Header } = Layout;

const HeaderComponent = () => {
  const { isAuthenticated, user, logout, accountType } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatRoom, setCurrentChatRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user_user'))?.id;
  const navigate = useNavigate();

  // Fetch profile first
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.email) {
          const data = await getCandidateProfileByEmail(user.email);
          setProfile(data);
          console.log("Loaded candidate profile:", data); // Debug log
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin profile:', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Kiểm tra cụ thể cho user
  const userToken = localStorage.getItem('user_token');
  const userUser = localStorage.getItem('user_user');
  const userType = localStorage.getItem('user_type');
  
  const shouldShowUserInfo = userToken && userUser && userType === 'user';

  // Load chat rooms after profile is loaded
  useEffect(() => {
    if (shouldShowUserInfo && profile?.id) {  // Sử dụng profile.id
      console.log("Loading chat rooms for candidate ID:", profile.id); // Debug log
      loadChatRooms();
      startUnreadCountPolling();
    }
  }, [shouldShowUserInfo, profile]); // Dependency vào profile thay vì user

  const loadChatRooms = async () => {
    try {
      if (!profile?.id) {
        console.error('Candidate ID not found');
        return;
      }

      const rooms = await getChatRooms(profile.id);
      console.log('Loaded chat rooms:', rooms);
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      message.error('Không thể tải danh sách tin nhắn');
    }
  };

  const startUnreadCountPolling = () => {
    if (!profile?.id) return null;

    const pollInterval = setInterval(async () => {
      try {
        let totalUnread = 0;
        
        for (const room of chatRooms) {
          const count = await getUnreadCount(room.roomId, profile.id);
          totalUnread += count;
        }
        
        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error polling unread count:', error);
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  };

  const handleLogout = async () => {
    try {
      await logout('user');  // Thêm type khi logout
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Chỉ giữ lại useEffect để debug nếu cần
  useEffect(() => {
    console.log('Auth State:', { isAuthenticated, user });
    console.log('LocalStorage:', {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    });
  }, [isAuthenticated, user]);

  // Menu dành cho người dùng đã đăng nhập
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<SettingOutlined />}>
        <Link
          to="/profile/myprofile"
          style={{ textDecoration: "none", color: "#000" }}
        >
          Quản lý hồ sơ
        </Link>
      </Menu.Item>
      <Menu.Item key="account" icon={<SettingOutlined />}>
        <a
          href="/profile/settings"
          style={{ textDecoration: "none", color: "#000" }}
        >
          Quản lý tài khoản
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        <span style={{ textDecoration: "none", color: "#000" }}>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  // Menu dành cho người dùng chưa đăng nhập
  const guestMenu = (
    <Menu>
      <Menu.Item key="register">
        <a href="/register" style={{ textDecoration: "none", color: "#000" }}>
          Đăng ký
        </a>
      </Menu.Item>
      <Menu.Item key="login">
        <a href="/login" style={{ textDecoration: "none", color: "#000" }}>
          Đăng nhập
        </a>
      </Menu.Item>
    </Menu>
  );

  const handleEmployerClick = () => {
    window.open('/homeEmployer', '_blank');
  };

  const handleChatClick = () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để sử dụng chat');
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  const handleChatRoomSelect = (room) => {
    setCurrentChatRoom(room);
    setIsChatOpen(true);

    // Reset unreadCount cho room này
    setChatRooms(prevRooms => {
      return prevRooms.map(r => {
        if (r.roomId === room.roomId) {
          return { ...r, unreadCount: 0 };
        }
        return r;
      });
    });

    // Cập nhật tổng số tin nhắn chưa đọc
    setUnreadCount(prev => Math.max(0, prev - (room.unreadCount || 0)));

    // Đánh dấu tin nhắn đã đọc trên server
    if (profile?.id) {
      fetch(`${API_URL}/chatroom/messages/read?roomId=${room.roomId}&userId=${profile.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      }).catch(error => {
        console.error('Error marking messages as read:', error);
      });
    }
  };

  const chatMenu = (
    <Menu>
      {chatRooms.map(room => (
        <Menu.Item 
          key={room.roomId}
          onClick={() => handleChatRoomSelect(room)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar 
              size="small" 
              src={room.employerAvatar}
              icon={<UserOutlined />}
            />
            <span>{room.employerName}</span>
            {room.unreadCount > 0 && (
              <Badge count={room.unreadCount} style={{ marginLeft: 'auto' }} />
            )}
          </div>
        </Menu.Item>
      ))}
      {chatRooms.length === 0 && (
        <Menu.Item disabled>
          Chưa có cuộc trò chuyện nào
        </Menu.Item>
      )}
    </Menu>
  );

  // Kiểm tra xác thực và profile trước khi hiển thị chat
  const shouldShowChat = profile?.id && shouldShowUserInfo;

  useEffect(() => {
    if (profile?.id) {
      // Kết nối WebSocket khi component mount
      const connectWebSocket = async () => {
        try {
          await WebSocketService.connect();
          
          // Subscribe để nhận tin nhắn mới
          await WebSocketService.subscribe(
            `/user/${profile.id}/queue/messages`,
            handleNewMessage
          );

          // Subscribe để nhận cập nhật số tin chưa đọc
          await WebSocketService.subscribe(
            `/user/${profile.id}/queue/unread`,
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
      loadUnreadCount(); // Load số tin nhắn chưa đọc ban đầu

      return () => {
        WebSocketService.disconnect();
      };
    }
  }, [profile]);

  const handleNewMessage = (message) => {
    try {
      const messageData = JSON.parse(message.body);
      console.log('Received new message:', messageData);
      
      // Cập nhật số tin nhắn chưa đọc ngay lập tức
      if (messageData.senderId !== profile.id) { // Chỉ tăng khi tin nhắn từ người khác
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

        // Hiển thị thông báo
        notification.info({
          message: 'Tin nhắn mới',
          description: messageData.content,
          placement: 'topRight',
          duration: 3
        });

        // Phát âm thanh thông báo
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
        `${API_URL}/chatroom/unread-count/${profile.id}`,
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

  return (
    <Header 
      className="header"
      style={{
        background: "#fff",
        borderBottom: "1px solid #ddd",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <img src={logo} onClick={() => navigate('/')} alt="Logo" style={{ height: "40px" , cursor: "pointer"}} />

        {/* Middle Navigation Links */}
        <Menu
          mode="horizontal"
          style={{
            borderBottom: "none",
            flex: 1,
            justifyContent: "center",
            display: "flex",
            textAlign: "center",
          }}
        >
          <Menu.Item key="jobs" icon={<SearchOutlined />}>
            <Link to="/jobs" style={{ textDecoration: "none", color: "#000" }}>
              Ngành nghề/ Địa điểm
            </Link>
          </Menu.Item>
          <Menu.Item key="companies" icon={<BankOutlined />}>
            <Link to="/companies" style={{ textDecoration: "none", color: "#000" }}>
              Công ty
            </Link>
          </Menu.Item>
          <Menu.Item key="guide" icon={<FileTextOutlined />}>
            <Link to="/guide" style={{ textDecoration: "none", color: "#000" }}>
              Cẩm nang việc làm
            </Link>
          </Menu.Item>
          <Menu.Item key="cv-builder" icon={<FileTextOutlined />}>
            <Link to="/cv-builder" style={{ textDecoration: "none", color: "#000" }}>
              Mẫu CV xin việc
            </Link>
          </Menu.Item>
        </Menu>

        {/* Right Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {shouldShowChat && (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <Dropdown 
                overlay={chatMenu} 
                trigger={['click']}
                placement="bottomRight"
              >
                <Badge count={unreadCount} offset={[-5, 5]}>
                  <Button
                    type="text"
                    icon={<MessageOutlined />}
                    onClick={handleChatClick}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    Tin nhắn
                  </Button>
                </Badge>
              </Dropdown>

              {isChatOpen && currentChatRoom && (
                <ChatRoom
                  roomId={currentChatRoom.roomId}
                  currentUser={{
                    id: profile.id,  // Sử dụng profile.id
                    type: 'CANDIDATE'
                  }}
                  otherUser={{
                    id: currentChatRoom.employerId,
                    name: currentChatRoom.employerName,
                    avatar: currentChatRoom.employerAvatar
                  }}
                  onClose={() => {
                    setIsChatOpen(false);
                    setCurrentChatRoom(null);
                  }}
                />
              )}
            </div>
          )}

          {shouldShowUserInfo ? (
            // Menu khi người dùng đã đăng nhập và là user
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar 
                  src={profile?.avatar}
                  style={{ backgroundColor: '#87d068' }} 
                  icon={!profile?.avatar || !user?.avatar && <UserOutlined />}
                />
                <span style={{ marginLeft: '10px', marginRight: '10px', color: '#000' }}>
                  {profile?.fullName || user?.email}
                </span>
              </div>
            </Dropdown>
          ) : (
            // Menu khi chưa đăng nhập hoặc không phải user
            <Dropdown overlay={guestMenu} placement="bottomRight" arrow>
              <Button type="link" icon={<UserOutlined />} style={{ color: '#CC0A9D' }}>
                Đăng ký / Đăng nhập
              </Button>
            </Dropdown>
          )}

          <Button
            type="text"
            onClick={handleEmployerClick}
            style={{
              color: '#000',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '4px 15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BankOutlined />
            Nhà tuyển dụng
          </Button>
        </div>
      </div>
    </Header>
  );
};

HeaderComponent.propTypes = {
  user: PropTypes.shape({
    full_name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default HeaderComponent;
