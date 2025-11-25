import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Tooltip, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { getAllEmployers } from '../../../api/employerApi';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TopCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployers();
      setCompanies(data.slice(0, 4));
    } catch (error) {
      message.error('Lỗi khi tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (companyId) => {
    navigate(`/companyDetail/${companyId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section style={{ padding: '50px 20px', background: '#f9f9f9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: '30px', fontWeight: '700', color: '#333' }}>
          Công ty hàng đầu
        </Title>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {companies.map((company) => (
            <Card
              key={company.id}
              hoverable
              onClick={() => handleCompanyClick(company.id)}
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                textAlign: 'center',
                background: '#fff',
                cursor: 'pointer'
              }}
              bodyStyle={{
                padding: '20px',
              }}
            >
              {/* Logo */}
              <div style={{ marginBottom: '15px' }}>
                <img
                  src={company.companyLogo || 'https://via.placeholder.com/80'} 
                  alt={company.companyName}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ddd',
                    padding: '5px',
                  }}
                />
              </div>
              {/* Tên Công Ty */}
              <Tooltip title={company.companyName}>
                <Title
                  level={4}
                  style={{
                    marginBottom: '10px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#333',
                  }}
                >
                  {company.companyName}
                </Title>
              </Tooltip>
              {/* Địa Chỉ */}
              <Tooltip title={company.companyAddress}>
                <Text
                  style={{
                    display: 'block',
                    color: '#555',
                    marginBottom: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <EnvironmentOutlined style={{ marginRight: '5px', color: '#888' }} />
                  {company.companyAddress}
                </Text>
              </Tooltip>
              {/* Website */}
              <Tooltip title={company.companyWebsite}>
                <Text
                  style={{
                    display: 'block',
                    color: '#777',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  🌐 {company.companyWebsite}
                </Text>
              </Tooltip>
            </Card>
          ))}
        </div>
        <Button
          type="primary"
          href="/companies"
          style={{
            marginTop: '20px',
            background: 'linear-gradient(to right, #020024, #cc0a9d)',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            textDecoration: 'none',
          }}
        >
          Xem thêm
        </Button>
      </div>
    </section>
  );
};

export default TopCompanies;
