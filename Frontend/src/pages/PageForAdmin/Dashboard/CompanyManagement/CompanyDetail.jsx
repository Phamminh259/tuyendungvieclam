import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  Tag, 
  Space, 
  Tabs, 
  Image, 
  Modal, 
  message,
  Spin 
} from 'antd';
import { 
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  BankOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getEmployerById, approveEmployer, suspendEmployer } from '../../../../api/employerApi';

const { TabPane } = Tabs;
const { confirm } = Modal;

const CompanyDetail = ({ id }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const data = await getEmployerById(id);
      setCompany(data);
    } catch (error) {
      message.error('Lỗi khi tải thông tin công ty');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    confirm({
      title: `Bạn có chắc chắn muốn ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'tạm ngưng'} công ty này?`,
      icon: <ExclamationCircleOutlined />,
      content: `Công ty sẽ ${newStatus === 'ACTIVE' ? 'có thể' : 'không thể'} đăng tin tuyển dụng sau khi thay đổi`,
      okText: newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Tạm ngưng',
      okType: newStatus === 'ACTIVE' ? 'primary' : 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          if (newStatus === 'ACTIVE') {
            await approveEmployer(id);
          } else {
            await suspendEmployer(id);
          }
          message.success(`${newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Tạm ngưng'} công ty thành công`);
          fetchCompanyDetails();
        } catch (error) {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Không tìm thấy thông tin công ty
      </div>
    );
  }

  return (
    <div>
      <Card
        title="Thông tin công ty"
        extra={
          <Button 
            type={company.status === 'ACTIVE' ? 'default' : 'primary'}
            danger={company.status === 'ACTIVE'}
            onClick={() => handleStatusChange(company.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
          >
            {company.status === 'ACTIVE' ? 'Tạm ngưng' : 'Kích hoạt'}
          </Button>
        }
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="Thông tin cơ bản" key="basic">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tên công ty" span={2}>
                <Space>
                  <Image
                    src={company.companyLogo}
                    alt={company.companyName}
                    width={40}
                    height={40}
                    fallback="data:image/png;base64,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"
                  />
                  {company.companyName}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Khu vực" span={2}>
                <Space>
                  <EnvironmentOutlined />
                  {company.location}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ chi tiết" span={2}>
                <Space>
                  <EnvironmentOutlined />
                  {company.companyAddress}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Website" span={2}>
                <Button type="link" href={company.companyWebsite} target="_blank" icon={<GlobalOutlined />}>
                  {company.companyWebsite}
                </Button>
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại công ty" span={2}>
                <Space>
                  <PhoneOutlined />
                  {company.companyPhone}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Quy mô" span={2}>
                <Tag icon={<TeamOutlined />} color="blue">
                  {company.companySize}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={company.status === 'ACTIVE' ? 'green' : 'red'}>
                  {company.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm ngưng'}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Thống kê tin tuyển dụng" span={2}>
                <Space size="large">
                  <Tag color="blue">
                    Tổng số tin: {company.totalJobs || 0}
                  </Tag>
                  <Tag color="green">
                    Đang hoạt động: {company.activeJobs || 0}
                  </Tag>
                </Space>
              </Descriptions.Item>

            </Descriptions>

            
          </TabPane>
          <TabPane tab="Thông tin liên hệ" key="contact">
            <Descriptions bordered>
              <Descriptions.Item label="Người liên hệ" span={3}>
                <Space>
                  <IdcardOutlined />
                  {company.contactName} - {company.contactPosition}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Email" span={3}>
                <Button type="link" href={`mailto:${company.contactEmail}`} icon={<MailOutlined />}>
                  {company.contactEmail}
                </Button>
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại" span={3}>
                <Button type="link" href={`tel:${company.contactPhone}`} icon={<PhoneOutlined />}>
                  {company.contactPhone}
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane tab="Thông tin pháp lý" key="legal">
            <Descriptions bordered>
              <Descriptions.Item label="Mã số thuế" span={3}>
                <Space>
                  <BankOutlined />
                  {company.taxCode}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Giấy phép kinh doanh" span={3}>
                <Button 
                  type="link" 
                  href={company.businessLicense} 
                  target="_blank"
                  icon={<FileTextOutlined />}
                >
                  Xem giấy phép
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CompanyDetail;