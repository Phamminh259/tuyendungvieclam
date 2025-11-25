import React, { useEffect, useState } from 'react';
import { Card, Tabs, message } from 'antd';
import { getAllPackages } from '../../../../api/packageApi';
import PackageList from './PackageList';
import PackageConfig from './PackageConfig';
import PaymentHistory from './PaymentHistory';

const { TabPane } = Tabs;

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await getAllPackages();
        setPackages(data);
      } catch (error) {
        message.error('Không thể tải danh sách gói dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <Card title="Quản lý gói dịch vụ">
      <Tabs defaultActiveKey="packages">
        <TabPane tab="Danh sách gói" key="packages">
          <PackageList />
        </TabPane>
        <TabPane tab="Thanh toán" key="payments">
          <PaymentHistory />
        </TabPane>
        <TabPane tab="Cấu hình" key="settings">
          <PackageConfig />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default PackageManagement; 