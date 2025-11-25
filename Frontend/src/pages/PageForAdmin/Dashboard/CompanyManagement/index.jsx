import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm';
import CompanyDetail from './CompanyDetail';

const { TabPane } = Tabs;

const CompanyManagement = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [activeKey, setActiveKey] = useState('list');

  const handleSelectCompany = (id) => {
    setSelectedCompanyId(id);
    setActiveKey('detail');
  };

  return (
    <Card title="Quản lý công ty">
      <Tabs 
        activeKey={activeKey} 
        onChange={setActiveKey}
      >
        <TabPane tab="Danh sách công ty" key="list">
          <CompanyList onSelectCompany={handleSelectCompany} />
        </TabPane>
        <TabPane tab="Thêm công ty" key="add">
          <CompanyForm />
        </TabPane>
        <TabPane tab="Chi tiết công ty" key="detail" disabled={!selectedCompanyId}>
          {selectedCompanyId && <CompanyDetail id={selectedCompanyId} />}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CompanyManagement; 