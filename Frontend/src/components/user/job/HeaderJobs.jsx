import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Dropdown, Input, Button, Avatar } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  MessageOutlined,
  BankOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import logo from '../../../assets/logos/logo.png';

const { Header } = Layout;

const HeaderJobs = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null); // Xóa trạng thái user
    localStorage.removeItem('user'); // Xóa user từ localStorage
    window.location.href = '/'; // Điều hướng về trang chủ
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<SettingOutlined />}>
        <a href="/profile-management" style={{ textDecoration: 'none', color: '#000' }}>
          Quản lý hồ sơ
        </a>
      </Menu.Item>
      <Menu.Item key="account" icon={<SettingOutlined />}>
        <a href="/account-management" style={{ textDecoration: 'none', color: '#000' }}>
          Quản lý tài khoản
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        <span style={{ textDecoration: 'none', color: '#000' }}>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  const guestMenu = (
    <Menu>
      <Menu.Item key="register">
        <a href="/register" style={{ textDecoration: 'none', color: '#000' }}>
          Đăng ký
        </a>
      </Menu.Item>
      <Menu.Item key="login">
        <a href="/login" style={{ textDecoration: 'none', color: '#000' }}>
          Đăng nhập
        </a>
      </Menu.Item>
    </Menu>
  );

  const navMenu = (
    <Menu>
      <Menu.Item key="jobs" icon={<SearchOutlined />}>
        <a href="/jobs" style={{ textDecoration: 'none', color: '#000' }}>
          Ngành nghề/ Địa điểm
        </a>
      </Menu.Item>
      <Menu.Item key="companies" icon={<BankOutlined />}>
        <a href="/companies" style={{ textDecoration: 'none', color: '#000' }}>
          Công ty
        </a>
      </Menu.Item>
      <Menu.Item key="guide" icon={<FileTextOutlined />}>
        <a href="#guide" style={{ textDecoration: 'none', color: '#000' }}>
          Cẩm nang việc làm
        </a>
      </Menu.Item>
      <Menu.Item key="cv-template" icon={<FileTextOutlined />}>
        <a href="#cv-template" style={{ textDecoration: 'none', color: '#000' }}>
          Mẫu CV Xin Việc
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: '#fff',
        borderBottom: '1px solid #ddd',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="/" style={{ display: 'inline-block' }}>
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </a>

        {/* Search Bar */}
        <div style={{ display: 'flex', flex: 1, margin: '0 20px', maxWidth: '600px' }}>
          <Input
            placeholder="Nhập tên vị trí, công ty, từ khóa"
            prefix={<SearchOutlined />}
            style={{ marginRight: '8px', height: '40px', borderRadius: '8px' }}
          />
          <Input
            placeholder="Nhập tỉnh, thành phố"
            prefix={<SearchOutlined />}
            style={{ marginRight: '8px', height: '40px', borderRadius: '8px' }}
          />
          <Button
            type="primary"
            style={{
              background: 'linear-gradient(to right, #020024, #cc0a9d)',
              border: 'none',
              height: '40px',
              borderRadius: '8px',
            }}
          >
            Tìm kiếm ngay
          </Button>
        </div>

        {/* Right Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Dropdown Menu */}
          <Dropdown overlay={navMenu} trigger={['click']} placement="bottomRight" arrow>
            <Button
              type="text"
              icon={<MenuOutlined />}
              style={{
                fontSize: '18px',
                color: '#000',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '5px 10px',
              }}
            />
          </Dropdown>

          <Button
            type="link"
            href="#chat"
            icon={<MessageOutlined />}
            style={{
              textDecoration: 'none',
              color: '#000',
            }}
          >
            Trò chuyện
          </Button>

          {/* User Info */}
          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#87d068' }}>
                  {user.full_name?.charAt(0) || <UserOutlined />}
                </Avatar>
                <span style={{ color: '#000', marginRight: '10px' }}>{user.full_name}</span>
              </div>
            </Dropdown>
          ) : (
            <Dropdown overlay={guestMenu} placement="bottomRight" arrow>
              <Button
                type="link"
                icon={<UserOutlined />}
                style={{
                  textDecoration: 'none',
                  color: '#000',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                Đăng ký / Đăng nhập
              </Button>
            </Dropdown>
          )}

          <Button
            type="link"
            href="/homeEmployer"
            style={{
              textDecoration: 'none',
              color: '#000',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '5px 10px',
            }}
          >
            Nhà tuyển dụng
          </Button>
        </div>
      </div>
    </Header>
  );
};

HeaderJobs.propTypes = {
  user: PropTypes.shape({
    full_name: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

export default HeaderJobs;
