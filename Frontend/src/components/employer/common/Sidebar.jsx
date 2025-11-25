import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  TeamOutlined,
  BankOutlined,
  BarChartOutlined,
  SettingOutlined,
  ProfileOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const { Sider } = Layout;
const { SubMenu } = Menu;

const StyledSider = styled(Sider)`
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }

  .logo {
    height: 64px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 8px;
  }

  .logo img {
    height: 32px;
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
    background-color: #1890ff;
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

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const menuItems = [
  {
    key: 'general',
    icon: <DashboardOutlined />,
    label: 'Tổng quát',
    children: [
      {
        key: '1',
        label: 'Tổng quan',
        path: '/dashboard'
      },
      {
        key: '2',
        label: 'Quản lý công ty',
        path: '/dashboard/company'
      }
    ]
  },
  {
    key: 'recruitment',
    icon: <ProfileOutlined />,
    label: 'Tuyển dụng',
    children: [
      {
        key: '3',
        label: 'Quản lý tin tuyển dụng',
        path: '/dashboard/job-posts'
      },
      {
        key: '4',
        label: 'Quản lý CV',
        path: '/dashboard/cv-management'
      },
      {
        key: '5',
        label: 'Quản lý ứng viên',
        path: '/dashboard/candidates'
      }
    ]
  },
  {
    key: '6',
    icon: <BarChartOutlined />,
    label: 'Báo cáo & Thống kê',
    path: '/dashboard/analytics'
  },
  {
    key: '7',
    icon: <DollarOutlined />,
    label: 'Gói dịch vụ',
    path: '/dashboard/subscription'
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const normalizedPath = currentPath.endsWith('/') 
      ? currentPath.slice(0, -1) 
      : currentPath;

    let selectedKey = '1'; // Default là tổng quan
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
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKey()}
        defaultOpenKeys={['general', 'recruitment']}
      >
        {renderMenuItems(menuItems)}
      </Menu>

      <div className="toggle-button" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </StyledSider>
  );
};

export default Sidebar; 