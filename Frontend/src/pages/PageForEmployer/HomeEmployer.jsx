import React, { useState, useEffect, useContext } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Divider,
  List,
  Timeline,
  Collapse,
  message,
  Tag,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  QuestionCircleOutlined,
  SmileOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Header from "../../components/employer/common/Header";
import Footer from "../../components/user/common/Footer";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../components/auth/AuthProvider';
import { createSubscription } from '../../api/subscriptionApi';
import { getAllPackages } from '../../api/packageApi';
import { getPermissionIcon, formatPermissionValue, getPermissionTagColor } from '../../components/common/Permission';

const { Title, Paragraph } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;

const HomeEmployer = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || '0';
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await getAllPackages();
      console.log('Packages:', response);
      setPackages(response);
    } catch (error) {
      console.error('Error fetching packages:', error);
      message.error('Không thể tải danh sách gói dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const processSteps = [
    "Đăng ký tài khoản và lựa chọn gói dịch vụ.",
    "Tạo bài đăng tuyển dụng với các tiêu chí chi tiết.",
    "Sử dụng công cụ phân tích để xem xét ứng viên tiềm năng.",
    "Liên hệ với ứng viên và tổ chức phỏng vấn.",
    "Hoàn tất quy trình tuyển dụng với sự hỗ trợ của chúng tôi.",
  ];

  const faqs = [
    {
      question: "Làm thế nào để đăng ký tài khoản?",
      answer:
        "Bạn có thể đăng ký tài khoản miễn phí trên trang của chúng tôi bằng cách nhấp vào nút 'Đăng ký'.",
    },
    {
      question: "Tôi có thể hủy gói dịch vụ đã đăng ký không?",
      answer:
        "Có, bạn có thể hủy gói dịch vụ bất cứ lúc nào trong phần quản lý tài khoản.",
    },
    {
      question: "Hỗ trợ khách hàng hoạt động như thế nào?",
      answer:
        "Chúng tôi có đội ngũ hỗ trợ trực tuyến 24/7 để giải đáp mọi thắc mắc của bạn.",
    },
  ];

  const handleBuyNow = async (pkg) => {
    try {
      if (!user || !user.id) {
        message.error('Vui lòng đăng nhập để mua gói dịch vụ');
        navigate('/login-employer');
        return;
      }

      setLoading(true);

      // 1. Tạo subscription trước
      const subscriptionData = {
        packageId: pkg.id,
        employerId: user.id
      };

      console.log('Creating subscription with data:', subscriptionData);
      const subscriptionResponse = await createSubscription(subscriptionData);
      
      if (!subscriptionResponse?.id) {
        throw new Error('Không thể tạo subscription');
      }

      console.log('Subscription created:', subscriptionResponse);

      // 2. Lưu thông tin vào localStorage
      localStorage.setItem('selected_package', JSON.stringify({
        ...pkg,
        subscriptionId: subscriptionResponse.id // Thêm subscriptionId vào thông tin gói
      }));

      // 3. Chuyển đến trang checkout
      navigate('/employer/checkout');

    } catch (error) {
      console.error('Error in buy now process:', error);
      if (error.response) {
        message.error(`Lỗi: ${error.response.data.message || 'Có lỗi xảy ra khi đăng ký gói dịch vụ'}`);
      } else {
        message.error('Có lỗi xảy ra khi đăng ký gói dịch vụ');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPackageDescription = (pkg) => {
    if (!pkg.permissions) return '';
    return pkg.permissions
      .filter(p => p.isActive)
      .map(p => `${p.permissionName}: ${p.value}`)
      .join('\n');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <Header />
      <div style={{ 
        position: 'fixed', 
        top: '80px', 
        left: '20px', 
        zIndex: 1000 
      }}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            background: '#1890ff'
          }}
        >
          Quay lại trang chủ
        </Button>
      </div>

      <Content style={{ padding: "50px 100px" }}>
        {/* Section: Giới thiệu */}
        <section className="intro text-center">
          <Title level={2}>Dịch vụ của chúng tôi</Title>
          <Paragraph type="secondary">
            Tìm kiếm và tuyển dụng ứng viên phù hợp nhanh chóng với các gói dịch
            vụ đăng tuyển đa dạng.
          </Paragraph>
        </section>

        <Divider />

        {/* Section: Các gói dịch vụ */}
        <section className="services">
          <Title level={3} className="text-center" style={{ marginBottom: '40px' }}>
            Các Gói Dịch Vụ Đăng Tuyển
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {packages.map((pkg) => (
              <Col xs={24} sm={12} lg={8} key={pkg.id}>
                <Card
                  hoverable
                  className="package-card"
                  title={
                    <div style={{ textAlign: "center" }}>
                      <Title level={3} style={{ color: '#1890ff', marginBottom: 0 }}>
                        {pkg.packageName}
                      </Title>
                      <Title level={2} style={{ margin: '16px 0' }}>
                        {pkg.price?.toLocaleString('vi-VN')} VND
                        <span style={{ fontSize: "14px", color: "rgba(0,0,0,.45)" }}>
                          /{pkg.duration} ngày
                        </span>
                      </Title>
                    </div>
                  }
                  style={{
                    height: '100%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                  }}
                >
                  <List
                    dataSource={pkg.permissions?.filter(p => p.isActive) || []}
                    renderItem={(permission) => (
                      <List.Item>
                        <Space align="start" style={{ width: '100%' }}>
                          <div style={{ color: '#1890ff', fontSize: '20px', marginRight: '8px' }}>
                            {getPermissionIcon(permission.permissionName)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>
                              {permission.permissionName}
                            </div>
                            <Tag color={getPermissionTagColor(permission.value, permission.permissionName)}>
                              {formatPermissionValue(permission.value, permission.permissionName)}
                            </Tag>
                          </div>
                        </Space>
                      </List.Item>
                    )}
                  />
                  <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => handleBuyNow(pkg)}
                      loading={loading}
                      style={{
                        width: '80%',
                        height: '40px',
                        borderRadius: '20px',
                        fontWeight: 500
                      }}
                    >
                      Mua ngay
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <Divider />

        {/* Section: Lợi ích */}
        <section className="benefits text-center">
          <Title level={3}>Lợi ích khi sử dụng dịch vụ của chúng tôi</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} lg={8}>
              <Card bordered={false}>
                <SmileOutlined style={{ fontSize: "40px", color: "#52c41a" }} />
                <Paragraph>
                  Tiết kiệm thời gian với công cụ tự động hóa trong tuyển dụng.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card bordered={false}>
                <SmileOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
                <Paragraph>
                  Tăng khả năng tiếp cận đến hàng ngàn ứng viên tiềm năng.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card bordered={false}>
                <SmileOutlined style={{ fontSize: "40px", color: "#ff4d4f" }} />
                <Paragraph>
                  Hỗ trợ tối ưu chi phí và cải thiện hiệu quả tuyển dụng.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </section>

        <Divider />

        {/* Section: Quy trình tuyển dụng */}
        <section className="process text-center">
          <Title level={3}>Quy trình tuyển dụng</Title>
          <Timeline mode="alternate">
            {processSteps.map((step, index) => (
              <Timeline.Item key={index}>{step}</Timeline.Item>
            ))}
          </Timeline>
        </section>

        <Divider />

        {/* Section: FAQ */}
        <section className="faq">
          <Title level={3}>Câu hỏi thường gặp</Title>
          <Collapse>
            {faqs.map((faq, index) => (
              <Panel
                header={faq.question}
                key={index}
                icon={<QuestionCircleOutlined />}
              >
                <Paragraph>{faq.answer}</Paragraph>
              </Panel>
            ))}
          </Collapse>
        </section>

        <Divider />

        {/* Section: Đối tác chiến lược */}
        <section className="partners text-center">
          <Title level={3}>Đối tác chiến lược</Title>
          <Row gutter={[16, 16]} justify="center">
            {["Google", "Microsoft", "Amazon"].map((partner, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card bordered={false}>
                  <Title level={4}>{partner}</Title>
                  <Paragraph>
                    Hợp tác chiến lược để mang lại lợi ích tối ưu cho khách
                    hàng.
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>
      <Footer />
    </Layout>
  );
};

export default HomeEmployer;
