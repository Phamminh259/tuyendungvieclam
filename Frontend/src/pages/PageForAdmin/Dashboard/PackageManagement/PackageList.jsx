import React, { useEffect, useState } from 'react';
import { Table, message, Tag, Tooltip } from 'antd';
import { getAllPackages } from '../../../../api/packageApi';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await getAllPackages();
        setPackages(data);
      } catch (error) {
        message.error('Không thể tải danh sách gói dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const columns = [
    {
      title: 'Tên gói',
      dataIndex: 'packageName',
      key: 'packageName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => <span>{text} tháng</span>,
    },
    {
      title: 'Quyền',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <ul style={{ paddingLeft: 20 }}>
          {permissions.map((perm) => (
            <li key={perm.id} style={{ marginBottom: 5 }}>
              <Tooltip title={perm.permissionName} placement="topLeft">
                <Tag color={perm.isActive ? 'green' : 'red'}>
                  {perm.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {perm.permissionName} - {perm.value}
                </Tag>
              </Tooltip>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return <Table dataSource={packages} columns={columns} loading={loading} rowKey="id" bordered />;
};

export default PackageList; 