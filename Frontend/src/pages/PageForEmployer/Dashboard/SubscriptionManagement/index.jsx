import React from 'react';
import { Card, Tabs, Button } from 'antd';
import CurrentSubscription from './CurrentSubscription';
import PaymentHistory from './PaymentHistory';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const SubscriptionManagement = () => {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    window.open('/homeEmployer?tab=1', '_blank');
  };

  return (
    <Card title="Quản lý gói dịch vụ">
      <Tabs defaultActiveKey="current">
        <TabPane tab="Gói hiện tại" key="current">
          <CurrentSubscription />
        </TabPane>
        <TabPane tab="Lịch sử thanh toán" key="history">
          <PaymentHistory />
        </TabPane>
        <TabPane tab="Nâng cấp gói" key="upgrade" onClick={handleUpgradeClick}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Xem các gói dịch vụ và nâng cấp tại trang chủ</p>
            <Button type="primary" onClick={handleUpgradeClick}>
              Xem các gói dịch vụ
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SubscriptionManagement; 