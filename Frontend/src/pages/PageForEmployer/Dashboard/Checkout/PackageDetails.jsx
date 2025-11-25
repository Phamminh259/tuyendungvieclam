import React from 'react';
import { Card, List, Tag, Typography, Space, Divider, Empty } from 'antd';
import { DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getPermissionIcon, formatPermissionValue, getPermissionTagColor } from '../../../../components/common/Permission';

const { Text, Title } = Typography;

const PackageDetails = ({ packageData }) => {
  if (!packageData) {
    return <Card><Empty description="Không có thông tin gói" /></Card>;
  }

  return (
    <Card 
      className="package-details-card"
      bordered={false}
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header với tên gói và thông tin cơ bản */}
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            {packageData.packageName}
          </Title>
          <Space size="large" style={{ marginTop: '16px' }}>
            <Space>
              <DollarOutlined style={{ color: '#52c41a' }} />
              <Text strong style={{ fontSize: '20px', color: '#52c41a' }}>
                {packageData.price?.toLocaleString('vi-VN')} VND
              </Text>
            </Space>
            <Divider type="vertical" />
            <Space>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              <Text strong>{packageData.duration} ngày</Text>
            </Space>
          </Space>
        </div>

        <Divider style={{ margin: '0' }} />

        {/* Danh sách quyền lợi */}
        <List
          itemLayout="horizontal"
          dataSource={packageData.permissions || []}
          renderItem={(permission) => (
            <List.Item style={{ padding: '12px 0' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <span style={{ 
                    color: '#1890ff',
                    fontSize: '18px',
                    width: '24px',
                    display: 'inline-block'
                  }}>
                    {getPermissionIcon(permission.permissionName)}
                  </span>
                  <Text>{permission.permissionName}</Text>
                </Space>
                <Tag 
                  color={getPermissionTagColor(permission.value, permission.permissionName)}
                  style={{ 
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}
                >
                  {formatPermissionValue(permission.value, permission.permissionName)}
                </Tag>
              </Space>
            </List.Item>
          )}
        />

        {/* Footer với ghi chú */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            * Giá trên đã bao gồm VAT
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default PackageDetails; 