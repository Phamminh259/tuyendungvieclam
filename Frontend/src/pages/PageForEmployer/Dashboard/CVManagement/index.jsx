import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import CVFilter from './components/CVFilter';
import CVList from './components/CVList';
import CVDetail from './components/CVDetail';

const { Title } = Typography;

const CVManagement = () => {
  const [selectedCV, setSelectedCV] = useState(null);
  const [filters, setFilters] = useState({
    searchText: '',
    status: 'all'
  });

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Card>
      <Title level={2}>Quản lý hồ sơ ứng viên</Title>
      <CVFilter onFilter={handleFilter} />
      <CVList 
        onSelect={setSelectedCV} 
        filters={filters}
      />
      {selectedCV && (
        <CVDetail 
          data={selectedCV} 
          onClose={() => setSelectedCV(null)} 
        />
      )}
    </Card>
  );
};

export default CVManagement; 