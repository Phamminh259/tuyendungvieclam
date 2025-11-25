import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import JobList from './JobList';
import JobDetail from './JobDetail';

const { TabPane } = Tabs;

const JobManagement = () => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [activeKey, setActiveKey] = useState('list');

  const handleSelectJob = (id) => {
    setSelectedJobId(id);
    setActiveKey('detail');
  };

  return (
    <Card title="Quản lý tin tuyển dụng">
      <Tabs 
        activeKey={activeKey} 
        onChange={setActiveKey}
      >
        <TabPane tab="Danh sách tin tuyển dụng" key="list">
          <JobList onSelectJob={handleSelectJob} />
        </TabPane>
        <TabPane tab="Chi tiết tin tuyển dụng" key="detail" disabled={!selectedJobId}>
          {selectedJobId && <JobDetail id={selectedJobId} />}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default JobManagement; 