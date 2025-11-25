import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../../components/employer/common/Header.jsx';
import Sidebar from '../../../components/employer/common/Sidebar';

const DashboardLayout = ({ user }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent />
      <Layout>
        <Sidebar />
        <Layout.Content style={{ padding: '24px' }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
