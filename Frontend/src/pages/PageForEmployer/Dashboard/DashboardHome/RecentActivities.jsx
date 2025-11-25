import React from 'react';
import { Timeline } from 'antd';
import { 
  UserOutlined, 
  FileOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

const RecentActivities = () => {
  return (
    <Timeline>
      <Timeline.Item dot={<UserOutlined />}>
        Ứng viên mới ứng tuyển vị trí Frontend Developer
        <p style={{ color: 'gray' }}>2 giờ trước</p>
      </Timeline.Item>
      <Timeline.Item dot={<FileOutlined />}>
        Đăng tin tuyển dụng mới: "Senior Backend Developer"
        <p style={{ color: 'gray' }}>3 giờ trước</p>
      </Timeline.Item>
      <Timeline.Item dot={<CheckCircleOutlined />}>
        Duyệt CV ứng viên cho vị trí UI/UX Designer
        <p style={{ color: 'gray' }}>5 giờ trước</p>
      </Timeline.Item>
      <Timeline.Item dot={<UserOutlined />}>
        Cập nhật trạng thái phỏng vấn cho ứng viên
        <p style={{ color: 'gray' }}>1 ngày trước</p>
      </Timeline.Item>
    </Timeline>
  );
};

export default RecentActivities; 