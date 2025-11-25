import React, { useEffect, useState, useContext } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { PhoneOutlined, MailOutlined, CalendarOutlined, MessageOutlined } from '@ant-design/icons';
import { getAcceptedApplicationsByEmployer } from '../../../../../api/applicationApi';
import { AuthContext } from '../../../../../components/auth/AuthProvider';
import { createChatRoom } from '../../../../../api/chatApi';

const CandidateList = ({ onSelect }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [chatLoading, setChatLoading] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchAcceptedCandidates();
    }
  }, [user]);

  const fetchAcceptedCandidates = async () => {
    try {
      setLoading(true);
      const employerId = user?.id;

      if (!employerId) {
        message.error('Không tìm thấy thông tin nhà tuyển dụng');
        return;
      }

      const data = await getAcceptedApplicationsByEmployer(employerId);
      const sortedData = data.sort((a, b) => 
        new Date(b.applications[0]?.createdDate) - new Date(a.applications[0]?.createdDate)
      );
      setCandidates(sortedData);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ứng viên:', error);
      message.error('Có lỗi xảy ra khi tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChatRoom = async (candidateId) => {
    try {
      setChatLoading(prev => ({ ...prev, [candidateId]: true }));
      
      const employerUser = localStorage.getItem('employer_user');
      if (!employerUser) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const employer = JSON.parse(employerUser);
      console.log('Creating chat room with:', {
        employerId: employer.id,
        candidateId: candidateId
      });

      const chatRoom = await createChatRoom(employer.id, candidateId);
      console.log('Chat room created:', chatRoom);

      if (chatRoom) {
        message.success('Đã tạo phòng chat thành công');
        window.dispatchEvent(new CustomEvent('openChatRoom', { 
          detail: chatRoom 
        }));
      }

    } catch (error) {
      console.error('Error details:', error.response?.data);
    } finally {
      setChatLoading(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  const columns = [
    {
      title: 'Ứng viên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space direction="vertical">
          <span>{text}</span>
          <Space>
            <Tag icon={<PhoneOutlined />}>{record.phone}</Tag>
            <Tag icon={<MailOutlined />}>{record.email}</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Vị trí ứng tuyển',
      dataIndex: 'applications',
      key: 'jobTitle',
      render: (applications) => (
        <>
          {applications?.map(app => 
            app.status === 'Accepted' && (
              <Tag color="green" key={app.id}>
                {app.jobTitle}
              </Tag>
            )
          )}
        </>
      )
    },
    {
      title: 'Ngày chấp nhận',
      dataIndex: 'applications',
      key: 'acceptedDate',
      render: (applications) => {
        const acceptedApp = applications?.find(app => app.status === 'Accepted');
        return acceptedApp ? (
          <Space>
            <CalendarOutlined />
            {new Date(acceptedApp.createdDate).toLocaleDateString('vi-VN')}
          </Space>
        ) : null;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onSelect(record)}>
            Xem chi tiết
          </Button>
          <Button 
            icon={<MessageOutlined />}
            loading={chatLoading[record.id]}
            onClick={() => handleCreateChatRoom(record.id)}
          >
            Chat
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={candidates}
      loading={loading}
      rowKey="id"
    />
  );
};

export default CandidateList; 