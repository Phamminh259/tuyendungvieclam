import React, { useEffect, useState, useContext } from 'react';
import { List, Avatar, Tag, Space, message } from 'antd';
import { getCVsByEmployer } from '../../../../../api/applicationApi';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../../../components/auth/AuthProvider';

const CVList = ({ onSelect, filters }) => {
  const { user } = useContext(AuthContext);
  const [cvList, setCVList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchCVs();
    }
  }, [user, filters, pagination.current]);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const employerId = user?.id;
      
      if (!employerId) {
        message.error('Không tìm thấy thông tin nhà tuyển dụng');
        return;
      }

      const data = await getCVsByEmployer(employerId);
      let filteredData = data || [];
      
      filteredData = filteredData.filter(application => 
        application.applications.some(app => app.status === 'Pending')
      );

      if (filters?.searchText) {
        filteredData = filteredData.filter(application => 
          application.fullName?.toLowerCase().includes(filters.searchText.toLowerCase())
        );
      }

      const sortedData = filteredData.sort((a, b) => 
        new Date(b.applications[0]?.createdDate) - new Date(a.applications[0]?.createdDate)
      );

      setPagination(prev => ({
        ...prev,
        total: sortedData.length
      }));
      
      setCVList(sortedData);
    } catch (error) {
      message.error('Có lỗi khi tải danh sách CV');
      console.error('Lỗi khi lấy danh sách CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      current: page
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'processing';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Đang chờ';
      case 'Approved': return 'Đã duyệt';
      case 'Rejected': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <List
      loading={loading}
      itemLayout="vertical"
      dataSource={cvList}
      pagination={{
        ...pagination,
        onChange: handlePageChange,
        showTotal: (total) => `Tổng ${total} CV`,
        showSizeChanger: false
      }}
      renderItem={(cv) => (
        <List.Item 
          key={cv.id}
          onClick={() => onSelect(cv)}
          style={{ 
            cursor: 'pointer',
            padding: '20px',
            marginBottom: '10px',
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            }
          }}
        >
          <List.Item.Meta
            avatar={
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                src={cv.avatar}
              />
            }
            title={
              <Space size={20}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {cv.fullName}
                </span>
                <Tag color={getStatusColor(cv.applications[0]?.status)}>
                  {cv.applications[0]?.jobTitle || 'Chưa có thông tin'} - {getStatusText(cv.applications[0]?.status)}
                </Tag>
              </Space>
            }
            description={
              <Space direction="vertical" size={8}>
                <Space>
                  <MailOutlined /> {cv.email}
                </Space>
                <Space>
                  <PhoneOutlined /> {cv.phone}
                </Space>
                <Space>
                  <EnvironmentOutlined /> {cv.address}
                </Space>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default CVList; 