import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FlagOutlined,
  BankOutlined,
  GiftOutlined,
  BarChartOutlined,
  FileTextOutlined,
  LockOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../../assets/logos/logo.png';

const { Sider } = Layout;
const { SubMenu } = Menu;

const StyledSider = styled(Sider)`
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }

  .logo-section {
    height: 64px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 8px;

    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;

      img {
        height: 40px;
        width: auto;
        transition: all 0.3s;
      }

      .logo-text {
        color: white;
        font-size: 20px;
        font-weight: 600;
        opacity: ${props => props.collapsed ? 0 : 1};
        transition: all 0.3s;
        white-space: nowrap;
      }
    }
  }

  .ant-menu {
    flex: 1;
    padding: 12px;
  }

  .ant-menu-item {
    border-radius: 6px;
    margin: 4px 0;
    height: 48px;
    display: flex;
    align-items: center;
  }

  .ant-menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  .ant-menu-item.ant-menu-item-selected {
    background-color: #cc0a9d;
  }

  .toggle-button {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.65);
    cursor: pointer;
    transition: color 0.3s;
  }

  .toggle-button:hover {
    color: #fff;
  }

  .ant-menu-item a {
    text-decoration: none;
  }

  .ant-menu-submenu-title {
    text-decoration: none;
  }
`;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Tổng quan',
    children: [
      {
        key: '1',
        label: 'Dashboard',
        path: '/admin'
      },
      {
        key: '2',
        label: 'Thống kê hệ thống',
        path: '/admin/analytics'
      }
    ]
  },
  {
    key: 'management',
    icon: <TeamOutlined />,
    label: 'Quản lý',
    children: [
      {
        key: '3',
        label: 'Quản lý người dùng',
        path: '/admin/user-management'
      },
      {
        key: '4',
        label: 'Quản lý công ty',
        path: '/admin/company-management'
      },
      {
        key: '5',
        label: 'Quản lý tin tuyển dụng',
        path: '/admin/job-management'
      }
    ]
  },
  {
    key: '6',
    icon: <GiftOutlined />,
    label: 'Gói dịch vụ',
    path: '/admin/package-management'
  },
  {
    key: '7',
    icon: <FileTextOutlined />,
    label: 'Quản lý nội dung',
    path: '/admin/content-management'
  },
  {
    key: '8',
    icon: <SettingOutlined />,
    label: 'Cài đặt hệ thống',
    path: '/admin/settings'
  }
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const normalizedPath = currentPath.endsWith('/') 
      ? currentPath.slice(0, -1) 
      : currentPath;

    let selectedKey = '1';
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (normalizedPath === child.path) {
            selectedKey = child.key;
          }
        });
      } else if (normalizedPath === item.path) {
        selectedKey = item.key;
      }
    });
    return [selectedKey];
  };

  const renderMenuItems = (items) => {
    return items.map(item => {
      if (item.children) {
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.label}>
            {item.children.map(child => (
              <Menu.Item key={child.key}>
                <Link to={child.path}>{child.label}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      );
    });
  };

  return (
    <StyledSider
      width={260}
      collapsible
      collapsed={collapsed}
      trigger={null}
      theme="dark"
    >
      <div className="logo-section">
        <Link to="/admin" className="logo-link">
          <img src={logo} alt="Logo" />
          {!collapsed && <span className="logo-text">ADMIN</span>}
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKey()}
        defaultOpenKeys={['dashboard', 'management']}
      >
        {renderMenuItems(menuItems)}
      </Menu>

      <div className="toggle-button" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </StyledSider>
  );
};

export default AdminSidebar; 