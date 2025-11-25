import React, { useState, useEffect } from 'react';
import { Menu, Avatar, Typography, Space } from 'antd';
import { 
  UserOutlined, 
  BankOutlined, 
  FileTextOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import { getCandidateProfileByEmail } from '../../../api/candidateApi';

const { Text, Title } = Typography;

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.email) {
          const data = await getCandidateProfileByEmail(user.email);
          setProfile(data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin profile:', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Lấy active key từ đường dẫn hiện tại
  const getSelectedKey = () => {
    const path = location.pathname;
    const key = path.split('/').pop();
    return key || 'overview';
  };

  const menuItems = [
    {
      key: 'overview',
      icon: <UserOutlined />,
      label: 'Tổng Quan',
      path: '/profile/overview'
    },
    {
      key: 'myprofile',
      icon: <FileTextOutlined />,
      label: 'Hồ Sơ Của Tôi',
      path: '/profile/myprofile'
    },
    {
      key: 'company',
      icon: <BankOutlined />,
      label: 'Công Ty Của Tôi',
      path: '/profile/company'
    },
    {
      key: 'jobs',
      icon: <FileTextOutlined />,
      label: 'Việc Làm Của Tôi',
      path: '/profile/jobs'
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Thông Báo Việc Làm',
      path: '/profile/notifications'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Quản Lý Tài Khoản',
      path: '/profile/settings'
    }
  ];

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="profile-sidebar-container">
      {/* Phần thông tin cá nhân */}
      <div className="profile-info-section" style={{ padding: '24px 16px', textAlign: 'center'}}>
        <Avatar 
          size={100} 
          src={profile?.avatar}
          icon={!profile?.avatar && <UserOutlined />}
          style={{ marginBottom: '16px' }}
        />
        <Title level={5} style={{ margin: '8px 0' }}>
          {profile?.fullName || 'Chưa cập nhật'}
        </Title>
        <Space direction="vertical" size={0}>
          <Text type="secondary">{profile?.email}</Text>
          <Text type="secondary">{profile?.phone}</Text>
        </Space>
      </div>

      {/* Phần Menu */}
      <Menu
        mode="vertical"
        selectedKeys={[getSelectedKey()]}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => handleMenuClick(item)
        }))}
        style={{ borderRight: 0 }}
      />
    </div>
  );
};

export default ProfileSidebar; 