import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import CandidateList from './components/CandidateList';
import CandidateDetail from './components/CandidateDetail';
import InterviewSchedule from './components/InterviewSchedule';
import CandidateTracking from './components/CandidateTracking';
import CandidateSearch from './components/CandidateSearch';

const { TabPane } = Tabs;

const CandidateManagement = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseDetail = () => {
    setSelectedCandidate(null);
  };

  return (
    <Card title="Quản lý ứng viên">
      <Tabs defaultActiveKey="candidates">
        <TabPane 
          tab="Danh sách ứng viên" 
          key="candidates"
        >
          <CandidateList onSelect={handleSelectCandidate} />
        </TabPane>

        <TabPane 
          tab="Tìm kiếm ứng viên" 
          key="search"
        >
          <CandidateSearch onSelect={handleSelectCandidate} />
        </TabPane>

        <TabPane 
          tab="Lịch phỏng vấn" 
          key="interviews"
        >
          <InterviewSchedule />
        </TabPane>

        <TabPane 
          tab="Theo dõi tiến độ" 
          key="tracking"
        >
          <CandidateTracking />
        </TabPane>
      </Tabs>

      {selectedCandidate && (
        <CandidateDetail 
          data={selectedCandidate}
          onClose={handleCloseDetail}
        />
      )}
    </Card>
  );
};

export default CandidateManagement; 