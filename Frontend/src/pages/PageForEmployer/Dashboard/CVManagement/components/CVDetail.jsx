import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Timeline, Button, Space, message, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { updateApplicationStatus } from '../../../../../api/applicationApi';

const CVDetail = ({ data, onClose, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  if (!data) return null;

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setLoading(true);
      await updateApplicationStatus(applicationId, newStatus);
      
      message.success(
        newStatus === 'Accepted' 
          ? 'Đã chấp nhận ứng viên thành công' 
          : 'Đã từ chối ứng viên thành công'
      );
      
      // Gọi callback để refresh danh sách
      await onStatusUpdate?.();
      
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderActionButtons = (application) => {
    if (application.status === 'Pending') {
      return (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleUpdateStatus(application.id, 'Accepted')}
            loading={loading}
          >
            Chấp nhận
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleUpdateStatus(application.id, 'Rejected')}
            loading={loading}
          >
            Từ chối
          </Button>
        </Space>
      );
    }
    return null;
  };

  return (
    <Modal
      title="Chi tiết hồ sơ ứng viên"
      open={true}
      onCancel={handleClose}
      width={800}
      footer={[
        <Button key="close" onClick={handleClose}>
          Đóng
        </Button>
      ]}
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Họ và tên">{data.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{data.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{data.address}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {data.birthday && new Date(data.birthday).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {data.sex ? 'Nam' : 'Nữ'}
          </Descriptions.Item>
        </Descriptions>

        <h3 style={{ marginTop: 20 }}>Thông tin chuyên môn</h3>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Vị trí mong muốn">{data.title}</Descriptions.Item>
          <Descriptions.Item label="Mức lương mong muốn">
            {data.expectedSalary?.toLocaleString('vi-VN')} VNĐ
          </Descriptions.Item>
          <Descriptions.Item label="Lĩnh vực">{data.industryName}</Descriptions.Item>
          <Descriptions.Item label="Ngành nghề">{data.professionName}</Descriptions.Item>
          <Descriptions.Item label="Loại công việc">{data.jobType}</Descriptions.Item>
          <Descriptions.Item label="Cấp bậc">{data.jobLevel}</Descriptions.Item>
          <Descriptions.Item label="Kinh nghiệm">{data.experienceLevel}</Descriptions.Item>
          <Descriptions.Item label="Học vấn">{data.educationLevel}</Descriptions.Item>
        </Descriptions>

        {data.candidateSkills?.length > 0 && (
          <>
            <h3 style={{ marginTop: 20 }}>Kỹ năng</h3>
            <div>
              {data.candidateSkills.map(skill => (
                <Tag key={skill.id} color="blue">
                  {skill.skillName} - {skill.proficiencyLevel}
                </Tag>
              ))}
            </div>
          </>
        )}

        {data.attachedFile && (
          <div style={{ marginTop: 20 }}>
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => window.open(data.attachedFile, '_blank')}
            >
              Tải CV đính kèm
            </Button>
          </div>
        )}

        <h3 style={{ marginTop: 20 }}>Lịch sử ứng tuyển</h3>
        <Timeline
          items={data.applications?.map(app => ({
            color: getStatusColor(app.status),
            children: (
              <>
                <div><strong>{app.jobTitle}</strong></div>
                <div>Trạng thái: <Tag color={getStatusColor(app.status)}>{getStatusText(app.status)}</Tag></div>
                <div>Ngày ứng tuyển: {new Date(app.createdDate).toLocaleDateString('vi-VN')}</div>
                {renderActionButtons(app)}
              </>
            )
          }))}
        />
      </Spin>
    </Modal>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'blue';
    case 'Accepted': return 'green';
    case 'Rejected': return 'red';
    default: return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'Pending': return 'Đang chờ';
    case 'Accepted': return 'Đã chấp nhận';
    case 'Rejected': return 'Đã từ chối';
    default: return status;
  }
};

export default CVDetail; 