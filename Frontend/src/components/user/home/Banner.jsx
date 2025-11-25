import React from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RocketOutlined, LoginOutlined } from '@ant-design/icons';
import BannerImage from '../../../assets/image/Banner/hiring-banner.png';

const { Title, Text } = Typography;

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      background: '#f8f9fa',
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid #eaeaea'
    }}>
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `
          linear-gradient(135deg, rgb(248, 249, 250) 0%, rgb(233, 236, 239) 100%)
        `,
        zIndex: 1
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        gap: '40px'
      }}>
        <div style={{ flex: '0 0 55%' }}>
          <Title level={2} style={{ 
            color: '#2c3e50',
            marginBottom: '20px',
            fontSize: '2.5rem',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Tìm kiếm ứng viên tài năng cho doanh nghiệp của bạn
          </Title>
          <Text style={{ 
            fontSize: '18px', 
            display: 'block', 
            marginBottom: '30px',
            color: '#5a6c7d',
            lineHeight: '1.6'
          }}>
            Tiếp cận với hàng nghìn hồ sơ ứng viên chất lượng. 
            Đăng tin tuyển dụng dễ dàng và nhận được phản hồi nhanh chóng từ các ứng viên phù hợp.
          </Text>
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            marginTop: '40px'
          }}>
            <Button 
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate('/register-employer')}
              style={{
                background: 'linear-gradient(135deg, #00a0e4 0%, #0077b6 100%)',
                border: 'none',
                height: '48px',
                padding: '0 30px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Đăng ký doanh nghiệp
            </Button>
            <Button 
              size="large"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login-employer')}
              style={{
                background: 'white',
                borderColor: '#0077b6',
                color: '#0077b6',
                height: '48px',
                padding: '0 30px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Đăng nhập
            </Button>
          </div>
        </div>

        <div style={{ flex: '0 0 45%', textAlign: 'center' }}>
          <img 
            src={BannerImage}
            alt="Hiring Process"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <style>{`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default Banner; 