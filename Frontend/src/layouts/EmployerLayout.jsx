import React from 'react';
import { Layout } from 'antd';
import EmployerHeader from '../components/Employer/common/Header';
import EmployerSlideBar from '../components/Employer/common/SlideBar';

const { Content } = Layout;

const EmployerLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <EmployerHeader />
      <Layout>
        <EmployerSlideBar />
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployerLayout; 