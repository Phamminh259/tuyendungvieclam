import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import UpdateJob from './UpdateJob';
import { deleteJob } from '../../../../../api/jobApi';

const JobTable = ({ jobs, loading, onJobUpdated }) => {
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  const handleEdit = (jobId) => {
    setSelectedJobId(jobId);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateModalVisible(false);
    onJobUpdated?.();
  };

  const handleDelete = (jobId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa tin tuyển dụng này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setDeletingIds(prev => [...prev, jobId]);
          await deleteJob(jobId);
          message.success('Xóa tin tuyển dụng thành công');
          if (onJobUpdated) {
            await onJobUpdated();
          }
        } catch (error) {
          message.error('Lỗi khi xóa tin tuyển dụng');
        } finally {
          setDeletingIds(prev => prev.filter(id => id !== jobId));
        }
      },
    });
  };

  const columns = [
    {
      title: 'Mã tin',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: 'Lượt ứng tuyển',
      dataIndex: 'applicationCount',
      key: 'applicationCount',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Space>
          {record.approved ? (
            <Tag color="success">Đã duyệt</Tag>
          ) : (
            <Tag color="warning">Chờ duyệt</Tag>
          )}
          {!record.isActive && <Tag color="error">Hết hạn</Tag>}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        const isDeleting = deletingIds.includes(record.id);
        return (
          <Space>
            <Button type="link">Chi tiết</Button>
            <Button 
              type="link"
              onClick={() => handleEdit(record.id)}
              disabled={isDeleting}
            >
              Chỉnh sửa
            </Button>
            <Button 
              type="link" 
              danger
              onClick={() => handleDelete(record.id)}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa' : 'Xóa'}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table 
        columns={columns} 
        dataSource={jobs}
        loading={loading}
        rowKey="id"
      />

      <UpdateJob
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
        onSuccess={handleUpdateSuccess}
        jobId={selectedJobId}
      />
    </>
  );
};

export default JobTable;