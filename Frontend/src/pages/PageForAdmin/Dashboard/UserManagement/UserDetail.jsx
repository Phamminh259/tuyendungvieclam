import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Tag, Timeline, Tabs, message, Modal } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  ClockCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getAccountById, deactivateAccount } from '../../../../api/accountApi';
import { reloadPage } from '../../../../utils/pageUtils';

const { TabPane } = Tabs;
const { confirm } = Modal;

const UserDetail = ({ userId, onClose, onUpdateUserList, onBackToList }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const data = await getAccountById(userId);
      setUserData(data);
    } catch (error) {
      message.error('Lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const showDeactivateConfirm = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Người dùng sẽ không thể đăng nhập sau khi bị vô hiệu hóa',
      okText: 'Vô hiệu hóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDeactivate
    });
  };

  const handleDeactivate = async () => {
    try {
      await deactivateAccount(userId);
      onUpdateUserList();
      fetchUserData();
      reloadPage();
    } catch (error) {
      message.error('Lỗi khi vô hiệu hóa tài khoản');
      console.error('Lỗi khi vô hiệu hóa tài khoản:', error);
    }
  };

  if (loading) {
    return <Card loading={true} />;
  }

  return (
    <Card title="Chi tiết người dùng">
      <Tabs defaultActiveKey="info">
        <TabPane tab="Thông tin cơ bản" key="info">
          <Descriptions bordered>
            <Descriptions.Item label="Họ tên" span={3}>
              <UserOutlined /> {userData?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={3}>
              <MailOutlined /> {userData?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" span={3}>
              <PhoneOutlined /> {userData?.phone || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò" span={3}>
              <Tag color={userData?.role === 'ADMIN' ? 'red' : 'blue'}>
                {userData?.role}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={3}>
              <Tag color={userData?.status ? 'green' : 'red'}>
                {userData?.status ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={3}>
              <ClockCircleOutlined /> {new Date(userData?.createdDate).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            {userData?.status ? (
              <Button 
                type="primary" 
                danger 
                icon={<StopOutlined />}
                onClick={showDeactivateConfirm}
              >
                Vô hiệu hóa tài khoản
              </Button>
            ) : (
              <span>Không thể kích hoạt tài khoản</span>
            )}
          </div>
        </TabPane>

        <TabPane tab="Lịch sử hoạt động" key="history">
          <Timeline>
            {userData?.activities?.map((activity, index) => (
              <Timeline.Item key={index}>
                <p>{activity.action}</p>
                <p style={{ color: 'gray' }}>
                  {new Date(activity.timestamp).toLocaleString('vi-VN')}
                </p>
              </Timeline.Item>
            ))}
          </Timeline>
        </TabPane>
      </Tabs>
      <Button onClick={onBackToList}>Quay lại</Button>
    </Card>
  );
};

export default UserDetail; 