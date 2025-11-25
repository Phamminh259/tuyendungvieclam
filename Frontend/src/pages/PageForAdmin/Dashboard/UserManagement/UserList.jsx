import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, Tag, Space, Button, Select, Input, message, Modal } from 'antd';
import { SearchOutlined, UserOutlined, CheckCircleOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getAllAccounts, activateAccount } from '../../../../api/accountApi';
import { reloadPage } from '../../../../utils/pageUtils';

const { Option } = Select;
const { confirm } = Modal;

const UserList = forwardRef(({ onSelectUser }, ref) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: 'ALL',
    status: 'ALL',
    search: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      message.error('Lỗi khi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchAccounts
  }));

  const handleActivateUser = (userId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn kích hoạt tài khoản này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Người dùng sẽ có thể đăng nhập sau khi được kích hoạt',
      okText: 'Kích hoạt',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await activateAccount(userId);
          fetchAccounts();
          reloadPage();
        } catch (error) {
          message.error('Lỗi khi kích hoạt tài khoản');
        }
      }
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        if (!role) return <Tag>Không xác định</Tag>;
        
        const roleConfig = {
          'ROLE_ADMIN': { color: 'red', text: 'Admin' },
          'ROLE_EMPLOYER': { color: 'blue', text: 'Nhà tuyển dụng' },
          'ROLE_USER': { color: 'green', text: 'Người dùng' }
        };

        const config = roleConfig[role] || { color: 'default', text: role };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Admin', value: 'ROLE_ADMIN' },
        { text: 'Nhà tuyển dụng', value: 'ROLE_EMPLOYER' },
        { text: 'Người dùng', value: 'ROLE_USER' }
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const isActive = status === 'true' || status === true;
        return (
          <Tag 
            color={isActive ? 'green' : 'red'} 
            icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
          >
            {isActive ? 'Hoạt động' : 'Đã khóa'}
          </Tag>
        );
      },
      filters: [
        { text: 'Hoạt động', value: 'true' },
        { text: 'Đã khóa', value: 'false' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onSelectUser(record.id)}>
            Chi tiết
          </Button>
          {record.status === 'false' && (
            <Button 
              type="default" 
              onClick={() => handleActivateUser(record.id)}
            >
              Kích hoạt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleRoleFilter = (value) => {
    const roleMapping = {
      'ADMIN': 'ROLE_ADMIN',
      'EMPLOYER': 'ROLE_EMPLOYER',
      'USER': 'ROLE_USER',
      'ALL': 'ALL'
    };
    setFilters(prev => ({ ...prev, role: roleMapping[value] }));
  };

  const handleStatusFilter = (value) => {
    const statusMapping = {
      'ACTIVE': 'Hoạt động',
      'INACTIVE': 'Đã khóa',
      'ALL': 'ALL'
    };
    setFilters(prev => ({ ...prev, status: statusMapping[value] }));
  };

  const filteredAccounts = accounts.filter(account => {
    const matchSearch = filters.search 
      ? (
          (account.fullName?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
          (account.email?.toLowerCase() || '').includes(filters.search.toLowerCase())
        )
      : true;

    const matchRole = filters.role === 'ALL' ? true : account.role === filters.role;
    const matchStatus = filters.status === 'ALL' 
      ? true 
      : (filters.status === 'Hoạt động' ? account.status === 'true' : account.status === 'false');

    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên hoặc email"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select
          defaultValue="ALL"
          style={{ width: 150 }}
          onChange={handleRoleFilter}
        >
          <Option value="ALL">Tất cả vai trò</Option>
          <Option value="ADMIN">Admin</Option>
          <Option value="EMPLOYER">Nhà tuyển dụng</Option>
          <Option value="USER">Người dùng</Option>
        </Select>
        <Select
          placeholder="Trạng thái"
          value={filters.status}
          onChange={handleStatusFilter}
          style={{ width: 120 }}
        >
          <Option value="ALL">Tất cả</Option>
          <Option value="ACTIVE">Hoạt động</Option>
          <Option value="INACTIVE">Đã khóa</Option>
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredAccounts}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
});

export default UserList; 