import React from 'react';
import SearchBar from './SearchBar';
import { Typography, Space, Carousel, Tag } from 'antd';
import { 
  FireOutlined, 
  JavaOutlined,
  WindowsOutlined,
  BugOutlined,
  CodeOutlined,
  FundOutlined,
  NodeIndexOutlined,
  CrownOutlined,
  ApartmentOutlined,
  CloudOutlined,
  ApiOutlined,
  DatabaseOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  DotChartOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const trends = [
  // Slide 1
  [
    { name: 'Java', icon: <JavaOutlined />, color: '#ff6b6b' },
    { name: 'ReactJS', icon: <ApartmentOutlined />, color: '#4ecdc4' },
    { name: '.NET', icon: <WindowsOutlined />, color: '#45b7d1' },
    { name: 'Tester', icon: <BugOutlined />, color: '#96ceb4' },
    { name: 'PHP', icon: <CodeOutlined />, color: '#ff7f50' },
    { name: 'Business Analyst', icon: <FundOutlined />, color: '#4fb0c6' },
    { name: 'NodeJS', icon: <NodeIndexOutlined />, color: '#2ecc71' },
    { name: 'Manager', icon: <CrownOutlined />, color: '#f1c40f' },
    { name: 'NextJS', icon: <NodeIndexOutlined />, color: '#2ecc71' },
    { name: 'Python', icon: <NodeIndexOutlined />, color: '#2ecc71' },
  ],
  // Slide 2
  [
    { name: 'AWS Cloud', icon: <CloudOutlined />, color: '#ff9f43' },
    { name: 'API Developer', icon: <ApiOutlined />, color: '#ee5253' },
    { name: 'SQL Database', icon: <DatabaseOutlined />, color: '#0abde3' },
    { name: 'AI Engineer', icon: <RobotOutlined />, color: '#8e44ad' },
    { name: 'Security Expert', icon: <SafetyCertificateOutlined />, color: '#27ae60' },
    { name: 'Mobile Dev', icon: <MobileOutlined />, color: '#d35400' },
    { name: 'Data Science', icon: <DotChartOutlined />, color: '#3498db' },
    { name: 'DevOps', icon: <CloudOutlined />, color: '#e056fd' }
  ]
];

const Hero = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(to right, #020024, #cc0a9d)',
        padding: '100px 20px',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Phần tiêu đề */}
        <Space direction="vertical" size="large" style={{ width: '100%', marginBottom: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <Title
              level={1}
              style={{
                color: '#fff',
                fontSize: '4rem',
                lineHeight: '1.2',
                fontWeight: '800',
                marginBottom: '20px',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                background: 'linear-gradient(to right, #fff, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'titleAnimation 1.5s ease-out'
              }}
            >
              Tìm việc làm mơ ước
              <br />
              <span style={{
                fontSize: '3.5rem',
                background: 'linear-gradient(to right, #ffd700, #ff69b4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                của bạn
              </span>
            </Title>

            <Text style={{
              fontSize: '1.4rem',
              opacity: 0.9,
              color: '#fff',
              display: 'block',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              animation: 'fadeIn 1s ease-out 0.5s both'
            }}>
              Hơn <span style={{ 
                color: '#ffd700', 
                fontWeight: '600',
                fontSize: '1.6rem'
              }}>10,000</span> việc làm đang chờ đợi bạn
            </Text>

            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginTop: '25px',
              animation: 'fadeIn 1s ease-out 1s both'
            }}>
              <Tag style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                <CheckCircleOutlined style={{ color: '#ffd700', marginRight: '5px' }} />
                Việc làm chất lượng
              </Tag>
              <Tag style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                <SafetyOutlined style={{ color: '#ffd700', marginRight: '5px' }} />
                Uy tín & Bảo mật
              </Tag>
              <Tag style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                <ThunderboltOutlined style={{ color: '#ffd700', marginRight: '5px' }} />
                Tốc độ phản hồi nhanh
              </Tag>
            </div>
          </div>
        </Space>

        {/* Thanh tìm kiếm */}
        <SearchBar />

        {/* Xu hướng hiện nay */}
        <div style={{ 
          marginTop: '40px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '25px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <FireOutlined style={{ 
              fontSize: '24px', 
              color: '#ffd700'
            }} />
            <Text style={{
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#fff',
              letterSpacing: '1.5px',
              margin: 0
            }}>
              Xu hướng tuyển dụng nổi bật
            </Text>
          </div>

          <Carousel 
            autoplay 
            autoplaySpeed={1400} // Tốc độ chuyển động tự động
            dots={true} // Hiển thị dấu chấm
            dotPosition="bottom" // Vị trí dấu chấm
            style={{ marginBottom: '20px' }}
          >
            {trends.map((slideItems, slideIndex) => (
              <div key={slideIndex}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '10px 0'
                }}>
                  {slideItems.map((trend) => (
                    <div
                      key={trend.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, ${trend.color}40 0%, ${trend.color}20 100%)`,
                        borderRadius: '30px',
                        border: `1px solid ${trend.color}50`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 5px 15px ${trend.color}30`;
                        e.currentTarget.style.border = `1px solid ${trend.color}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.border = `1px solid ${trend.color}50`;
                      }}
                    >
                      <span style={{ 
                        color: '#fff',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        {trend.icon}
                        {trend.name}
                      </span>
                      
                      {/* Hiệu ứng shine */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shine 2s infinite linear',
                        zIndex: 1
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Custom style cho dots của Carousel */}
        <style jsx>{`
          .ant-carousel .slick-dots li button {
            background: rgba(255, 255, 255, 0.3);
            height: 8px;
            width: 8px;
            border-radius: 50%;
          }

          .ant-carousel .slick-dots li.slick-active button {
            background: #fff;
          }

          @keyframes shine {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(100%);
            }
          }

          @keyframes titleAnimation {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Hero;
