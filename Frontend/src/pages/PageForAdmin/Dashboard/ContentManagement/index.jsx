import React from 'react';
import { Card, Tabs } from 'antd';

const { TabPane } = Tabs;

const ContentManagement = () => {
  return (
    <Card title="Quản lý nội dung">
      <Tabs defaultActiveKey="categories">
        <TabPane tab="Danh mục" key="categories">
          {/* Quản lý danh mục */}
        </TabPane>
        <TabPane tab="Bài viết" key="posts">
          {/* Quản lý bài viết */}
        </TabPane>
        <TabPane tab="Banner" key="banners">
          {/* Quản lý banner */}
        </TabPane>
        <TabPane tab="Thông báo" key="notifications">
          {/* Quản lý thông báo */}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ContentManagement; 