import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Input, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getAllJobs, approveJob, rejectJob } from '../../../../api/jobApi';
import CustomPagination from '../../../../components/common/CustomPagination';
const { Option } = Select;

const JobList = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: 'ALL'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchJobs();
  }, [pagination.current, pagination.pageSize]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getAllJobs();
      setJobs(data);
      setPagination(prev => ({
        ...prev,
        total: data.length
      }));
    } catch (error) {
      message.error('Lỗi khi tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  const getPaginatedData = (data) => {
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  const handleStatusChange = (record) => {
    if (!record.isActive) {
      message.warning('Không thể thay đổi trạng thái tin đã hết hạn');
      return;
    }

    if (record.approved) {
      rejectJob(record.id)
        .then(() => {
          message.success('Hủy duyệt tin tuyển dụng thành công');
          fetchJobs();
        })
        .catch(() => message.error('Lỗi khi hủy duyệt tin tuyển dụng'));
    } else {
      approveJob(record.id)
        .then(() => {
          message.success('Duyệt tin tuyển dụng thành công');
          fetchJobs();
        })
        .catch(() => message.error('Lỗi khi duyệt tin tuyển dụng'));
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => onSelectJob(record.id)}>{text}</a>
      ),
    },
    {
      title: 'Công ty',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        if (!record.isActive) {
          return <Tag color="gray">Hết hạn</Tag>;
        }
        return (
          <Tag color={record.approved ? 'green' : 'red'}>
            {record.approved ? 'Đang hiển thị' : 'Chưa duyệt'}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => onSelectJob(record.id)}
          >
            Chi tiết
          </Button>
          {record.isActive && (
            <Button 
              type={record.approved ? 'default' : 'primary'}
              danger={record.approved}
              onClick={() => handleStatusChange(record)}
            >
              {record.approved ? 'Hủy duyệt' : 'Duyệt'}
            </Button>
          )}
        </Space>
      ),
    }
  ];

  const getFilteredData = () => {
    const filteredJobs = jobs.filter(job => {
      const matchSearch = searchText 
        ? job.title?.toLowerCase().includes(searchText.toLowerCase())
        : true;
      
      const matchStatus = filters.status === 'ALL' 
        ? true 
        : (filters.status === 'ACTIVE' ? job.approved : !job.approved);

      return matchSearch && matchStatus;
    });

    // Sắp xếp jobs: chưa duyệt lên đầu, sau đó sắp xếp theo ngày đăng mới nhất
    return filteredJobs.sort((a, b) => {
      // Ưu tiên 1: Job chưa duyệt
      if (!a.approved && b.approved) return -1;
      if (a.approved && !b.approved) return 1;
      
      // Ưu tiên 2: Ngày đăng mới nhất
      return new Date(b.createdDate) - new Date(a.createdDate);
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tiêu đề"
          allowClear
          enterButton
          style={{ width: 300 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onSearch={value => {
            setSearchText(value);
            setPagination(prev => ({ ...prev, current: 1 }));
          }}
        />
        <Select
          value={filters.status}
          style={{ width: 150 }}
          onChange={value => {
            setFilters(prev => ({ ...prev, status: value }));
            setPagination(prev => ({ ...prev, current: 1 }));
          }}
        >
          <Option value="ALL">Tất cả trạng thái</Option>
          <Option value="ACTIVE">Đã duyệt</Option>
          <Option value="INACTIVE">Chưa duyệt</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={getPaginatedData(getFilteredData())}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={getFilteredData().length}
          onChange={handlePageChange}
          showTotal={(total) => `Tổng số ${total} tin tuyển dụng`}
        />
      </div>
    </>
  );
};

export default JobList; 