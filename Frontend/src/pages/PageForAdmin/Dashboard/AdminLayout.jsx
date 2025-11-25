import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../../components/admin/common/AdminHeader';
import AdminSidebar from '../../../components/admin/common/AdminSidebar';

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar />
      <Layout>
        <AdminHeader />
        <Layout.Content style={{ padding: '24px' }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
