import React from 'react';
import { Layout, Row, Col, Typography, Divider, Space } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Link, Text } = Typography;

const FooterComponent = () => {
  return (
    <Footer
      style={{
        background: 'linear-gradient(to right, #020024, #cc0a9d)', // Gradient Background
        padding: '40px 20px',
        color: '#fff',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          {/* Cột 1 */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: '#fff' }}>
              Về chúng tôi
            </Title>
            <Space direction="vertical" size="small">
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Giới thiệu
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Liên hệ
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Điều khoản sử dụng
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Chính sách bảo mật
              </Link>
            </Space>
          </Col>

          {/* Cột 2 */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: '#fff' }}>
              Dành cho ứng viên
            </Title>
            <Space direction="vertical" size="small">
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Việc làm mới nhất
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Tạo CV
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Cẩm nang nghề nghiệp
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Tra cứu lương
              </Link>
            </Space>
          </Col>

          {/* Cột 3 */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: '#fff' }}>
              Dành cho nhà tuyển dụng
            </Title>
            <Space direction="vertical" size="small">
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Đăng tin tuyển dụng
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Tìm hồ sơ
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Giải pháp HR
              </Link>
              <Link href="#" style={{ color: '#fff', opacity: 0.9 }}>
                Bảng giá dịch vụ
              </Link>
            </Space>
          </Col>

          {/* Cột 4 */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: '#fff' }}>
              Kết nối với chúng tôi
            </Title>
            <Space size="large">
              <Link href="#" style={{ fontSize: '20px', color: '#fff', opacity: 0.9 }}>
                <FacebookOutlined />
              </Link>
              <Link href="#" style={{ fontSize: '20px', color: '#fff', opacity: 0.9 }}>
                <InstagramOutlined />
              </Link>
              <Link href="#" style={{ fontSize: '20px', color: '#fff', opacity: 0.9 }}>
                <LinkedinOutlined />
              </Link>
              <Link href="#" style={{ fontSize: '20px', color: '#fff', opacity: 0.9 }}>
                <TwitterOutlined />
              </Link>
            </Space>
          </Col>
        </Row>

        {/* Divider */}
        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.3)', margin: '30px 0' }} />

        {/* Bản quyền */}
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#fff', opacity: 0.8 }}>
            &copy; Tuyển dụng PM
          </Text>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
