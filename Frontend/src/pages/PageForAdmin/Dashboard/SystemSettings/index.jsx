import React from 'react';
import { Card, Tabs } from 'antd';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';

const { TabPane } = Tabs;

const SystemSettings = () => {
  return (
    <Card title="Cài đặt hệ thống">
      <Tabs defaultActiveKey="general">
        <TabPane tab="Cài đặt chung" key="general">
          <GeneralSettings />
        </TabPane>
        <TabPane tab="Bảo mật" key="security">
          <SecuritySettings />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SystemSettings; 