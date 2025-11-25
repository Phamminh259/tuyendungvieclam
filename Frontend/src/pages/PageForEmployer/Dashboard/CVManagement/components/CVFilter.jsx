import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const CVFilter = ({ onFilter }) => {
  const [filters, setFilters] = React.useState({
    searchText: '',
    status: 'all'
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newFilters = {
      ...filters,
      searchText: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleStatusChange = (value) => {
    const newFilters = {
      ...filters,
      status: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Space size="middle" style={{ marginBottom: 16 }}>
      <Input
        placeholder="Tìm kiếm theo tên ứng viên"
        allowClear
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        style={{ width: 300 }}
        value={filters.searchText}
        onChange={handleSearchChange}
      />
      <Select
        defaultValue="all"
        style={{ width: 200 }}
        onChange={handleStatusChange}
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value="Pending">Đang chờ</Option>
        <Option value="Accepted">Đã chấp nhận</Option>
        <Option value="Rejected">Đã từ chối</Option>
      </Select>
    </Space>
  );
};

export default CVFilter; 