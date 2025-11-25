import React from 'react';
import { Card, Typography, Carousel } from 'antd';
import { 
  LaptopOutlined, 
  ShoppingOutlined, 
  BankOutlined,
  LineChartOutlined,
  EditOutlined,
  TeamOutlined,
  RocketOutlined,
  ToolOutlined,
  MedicineBoxOutlined,
  GlobalOutlined,
  BookOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const categories = [
  // Slide 1
  [
    { title: 'Công nghệ thông tin', count: 1200, icon: <LaptopOutlined />, color: '#4ecdc4' },
    { title: 'Marketing', count: 800, icon: <ShoppingOutlined />, color: '#ff6b6b' },
    { title: 'Tài chính - Kế toán', count: 600, icon: <BankOutlined />, color: '#45b7d1' },
    { title: 'Kinh doanh', count: 950, icon: <LineChartOutlined />, color: '#96ceb4' },
    { title: 'Thiết kế', count: 400, icon: <EditOutlined />, color: '#ff7f50' },
    { title: 'Nhân sự', count: 350, icon: <TeamOutlined />, color: '#4fb0c6' }
  ],
  // Slide 2
  [
    { title: 'Khởi nghiệp', count: 300, icon: <RocketOutlined />, color: '#2ecc71' },
    { title: 'Xây dựng', count: 550, icon: <ToolOutlined />, color: '#f1c40f' },
    { title: 'Y tế', count: 420, icon: <MedicineBoxOutlined />, color: '#e74c3c' },
    { title: 'Ngoại ngữ', count: 280, icon: <GlobalOutlined />, color: '#9b59b6' },
    { title: 'Giáo dục', count: 480, icon: <BookOutlined />, color: '#3498db' },
    { title: 'Dịch vụ khách hàng', count: 630, icon: <CustomerServiceOutlined />, color: '#e67e22' }
  ]
];

const PopularCategories = () => {
  return (
    <section style={{
      padding: '60px 0',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Title level={2} style={{
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(to right, #2d067d, #cc0a9d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Ngành nghề phổ biến
        </Title>

        <Carousel
          autoplay
          autoplaySpeed={1400}
          dots={true}
          dotPosition="bottom"
          style={{ marginBottom: '40px' }}
        >
          {categories.map((slideItems, slideIndex) => (
            <div key={slideIndex}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                padding: '20px 0'
              }}>
                {slideItems.map((category) => (
                  <Card
                    key={category.title}
                    hoverable
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      background: '#fff',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                    bodyStyle={{
                      padding: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px'
                    }}
                  >
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      color: category.color,
                      transition: 'all 0.3s ease'
                    }}>
                      {category.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Title level={4} style={{
                        margin: '0 0 5px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        {category.title}
                      </Title>
                      <Text style={{
                        fontSize: '15px',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <span style={{ 
                          color: '#cc0a9d', 
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {category.count.toLocaleString()}
                        </span>
                        việc làm
                      </Text>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <style jsx>{`
        .ant-carousel .slick-dots li button {
          background: #cc0a9d50;
          height: 8px;
          width: 8px;
          border-radius: 50%;
        }

        .ant-carousel .slick-dots li.slick-active button {
          background: #cc0a9d;
        }

        .ant-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .ant-card:hover .category-icon {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default PopularCategories;
