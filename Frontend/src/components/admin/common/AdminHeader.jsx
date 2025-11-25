import React, { useContext } from 'react';
import { Layout, Menu, Dropdown, Button, Space, Avatar, Badge, Typography } from 'antd';
import { 
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../components/auth/AuthProvider';
import styled from 'styled-components';

const { Header } = Layout;
const { Text } = Typography;

// Định nghĩa màu chủ đạo
const primaryColor = '#cc0a9d';
const hoverColor = '#e60aaf';

const StyledHeader = styled(Header)`
  background: linear-gradient(to right, #020024, #cc0a9d);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 1000;

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .notification-badge {
    cursor: pointer;

    .ant-btn {
      color: rgba(255, 255, 255, 0.9);
      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .ant-badge-count {
      background: #fff;
      color: ${primaryColor};
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s;
    min-width: 200px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .ant-avatar {
      background: #fff;
      color: ${primaryColor};
      transition: all 0.3s;
      
      &:hover {
        transform: scale(1.05);
      }
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .user-name {
        font-weight: 600;
        color: #fff;
        font-size: 14px;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
      }

      .user-role {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
        line-height: 1;
      }
    }
  }

  .ant-dropdown-menu {
    padding: 4px;
    background: #fff;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .ant-dropdown-menu-item {
      border-radius: 4px;
      padding: 8px 12px;

      &:hover {
        background: rgba(204, 10, 157, 0.05);
      }

      .ant-badge {
        width: 100%;
      }
    }
  }
`;

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const adminToken = localStorage.getItem('admin_token');
  const adminUser = localStorage.getItem('admin_user');
  const adminType = localStorage.getItem('admin_type');
  
  const shouldShowAdminInfo = adminToken && adminUser && adminType === 'admin';

  const handleLogout = async () => {
    try {
      await logout('admin');
      navigate('/login-admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const notificationMenu = (
    <Menu>
      <Menu.Item key="1">
        <Badge dot color={primaryColor}>
          <span>Có 3 báo cáo mới cần xử lý</span>
        </Badge>
      </Menu.Item>
      <Menu.Item key="2">
        <span>5 tin tuyển dụng đang chờ duyệt</span>
      </Menu.Item>
      <Menu.Item key="3">
        <span>2 yêu cầu xác thực công ty mới</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="view-all">
        <Text style={{ color: primaryColor }}>
          Xem tất cả thông báo
        </Text>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/admin/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/admin/settings">Cài đặt hệ thống</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledHeader>
      {shouldShowAdminInfo && (
        <div className="header-right">
          <Dropdown 
            overlay={notificationMenu} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Badge count={5} className="notification-badge">
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: '20px' }} />}
                style={{ padding: '4px 8px', height: '40px', width: '40px' }}
              />
            </Badge>
          </Dropdown>

          <Dropdown 
            overlay={userMenu} 
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="user-info">
              <Avatar 
                size={40} 
                icon={<UserOutlined />}
              />
              <div className="user-details">
                <span className="user-name">
                  {JSON.parse(adminUser)?.email || 'Admin'}
                </span>
                <span className="user-role">
                  Quản trị viên
                </span>
              </div>
            </div>
          </Dropdown>
        </div>
      )}
    </StyledHeader>
  );
};

export default AdminHeader; 