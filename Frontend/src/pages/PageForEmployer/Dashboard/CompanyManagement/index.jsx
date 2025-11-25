import React from 'react';
import { Card, Tabs } from 'antd';
import CompanyProfile from './CompanyProfile';

const { TabPane } = Tabs;

const CompanyManagement = () => {
  return (
    <Card title="Quản lý thông tin công ty">
      <Tabs defaultActiveKey="profile">
        <TabPane tab="Hồ sơ công ty" key="profile">
          <CompanyProfile />
        </TabPane>
        <TabPane tab="Chi nhánh" key="branches">
          <p>Quản lý các chi nhánh</p>
        </TabPane>
        <TabPane tab="Đội ngũ" key="team">
          <p>Quản lý thành viên team tuyển dụng</p>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CompanyManagement;  {/* Thêm export default */}