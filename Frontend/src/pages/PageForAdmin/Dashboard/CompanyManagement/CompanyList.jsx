import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Input, Select, Card, Tooltip, Avatar, Badge, message, Modal } from 'antd';
import { 
  SearchOutlined, 
  CheckCircleOutlined, 
  StopOutlined, 
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getAllEmployers, approveEmployer, suspendEmployer } from '../../../../api/employerApi';
import CustomPagination from '../../../../components/common/CustomPagination';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CompanyList = ({ onSelectCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'ALL',
    search: '',
    industry: 'ALL'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, [pagination.current, pagination.pageSize]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployers();
      setCompanies(data);
      setPagination(prev => ({
        ...prev,
        total: data.length
      }));
    } catch (error) {
      message.error('Lỗi khi tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'orange';
      case 'SUSPENDED':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'INACTIVE':
        return 'Chưa hoạt động';
      case 'SUSPENDED':
        return 'Tạm ngưng';
      default:
        return 'Không xác định';
    }
  };

  const handleStatusChange = (record) => {
    const newStatus = record.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const title = newStatus === 'ACTIVE' ? 'kích hoạt' : 'tạm ngưng';

    Modal.confirm({
      title: `Bạn có chắc chắn muốn ${title} công ty này?`,
      icon: <ExclamationCircleOutlined />,
      content: `Công ty sẽ ${newStatus === 'ACTIVE' ? 'có thể' : 'không thể'} đăng tin tuyển dụng sau khi ${title}`,
      okText: newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Tạm ngưng',
      okType: newStatus === 'ACTIVE' ? 'primary' : 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          if (newStatus === 'ACTIVE') {
            await approveEmployer(record.id);
          } else {
            await suspendEmployer(record.id);
          }
          message.success(`${title} công ty thành công`);
          fetchCompanies(); // Refresh danh sách
        } catch (error) {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  const handleTableChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  const getCurrentPageData = () => {
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return companies.slice(startIndex, endIndex);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    handleTableChange(1, pagination.pageSize); // Reset về trang 1
  };

  const getFilteredData = () => {
    return companies.filter(company => {
      const matchSearch = searchText 
        ? company.companyName?.toLowerCase().includes(searchText.toLowerCase())
        : true;
      
      const matchStatus = filters.status === 'ALL' 
        ? true 
        : company.status === filters.status;

      return matchSearch && matchStatus;
    });
  };

  const handleViewDetails = (id) => {
    onSelectCompany(id);
  };

  const columns = [
    {
      title: 'Công ty',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text, record) => (
        <Space>
          <Avatar 
            src={record.companyLogo} 
            size={40}
            shape="square"
          >
            {text.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <EnvironmentOutlined /> {record.location}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Thông tin liên hệ',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <strong>{record.contactName}</strong> - {record.contactPosition}
          </div>
          <Space>
            <Tooltip title="Website">
              <Button type="link" icon={<GlobalOutlined />} href={record.companyWebsite} target="_blank" />
            </Tooltip>
            <Tooltip title="Điện thoại">
              <Button type="link" icon={<PhoneOutlined />} href={`tel:${record.companyPhone}`} />
            </Tooltip>
            <Tooltip title="Email">
              <Button type="link" icon={<MailOutlined />} href={`mailto:${record.contactEmail}`} />
            </Tooltip>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Quy mô',
      dataIndex: 'companySize',
      key: 'companySize',
      render: (size) => (
        <Tag icon={<TeamOutlined />} color="blue">
          {size}
        </Tag>
      ),
    },
    {
      title: 'Tin tuyển dụng',
      key: 'jobs',
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {record.activeJobs}/{record.totalJobs}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Đang tuyển/Tổng số
          </div>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
      filters: [
        { text: 'Đang hoạt động', value: 'ACTIVE' },
        { text: 'Chưa hoạt động', value: 'INACTIVE' },
        { text: 'Tạm ngưng', value: 'SUSPENDED' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => handleViewDetails(record.id)}
          >
            Chi tiết
          </Button>
          <Button 
            type={record.status === 'ACTIVE' ? 'default' : 'primary'}
            danger={record.status === 'ACTIVE'}
            onClick={() => handleStatusChange(record)}
          >
            {record.status === 'ACTIVE' ? 'Tạm ngưng' : 'Kích hoạt'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Danh sách công ty">
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên công ty"
          allowClear
          enterButton
          style={{ width: 300 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onSearch={handleSearch}
        />
        <Select
          value={filters.status}
          style={{ width: 150 }}
          onChange={value => {
            setFilters(prev => ({ ...prev, status: value }));
            handleTableChange(1, pagination.pageSize);
          }}
        >
          <Option value="ALL">Tất cả trạng thái</Option>
          <Option value="ACTIVE">Đang hoạt động</Option>
          <Option value="INACTIVE">Chưa hoạt động</Option>
          <Option value="SUSPENDED">Tạm ngưng</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handleTableChange}
          showTotal={(total) => `Tổng số ${total} công ty`}
        />
      </div>
    </Card>
  );
};

export default CompanyList; 