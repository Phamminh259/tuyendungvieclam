import React, { useEffect, useState } from 'react';
import { Select, Button, Input, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const SearchBar = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleAdvancedFilter = () => {
    navigate('/jobs', { 
      state: { selectedLocation } 
    });
  };

  return (
    <div
      style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        maxWidth: '1000px',
        margin: '20px auto',
      }}
    >
      <Row gutter={[16, 16]} justify="center" align="middle">
        {/* Ô tìm kiếm */}
        <Col xs={24} md={12}>
          <Input
            size="large"
            placeholder="Tìm kiếm việc làm, vị trí, công ty..."
            prefix={<SearchOutlined style={{ color: '#cc0a9d' }} />}
            style={{
              borderRadius: '8px',
              height: '45px',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              ':hover': {
                borderColor: '#cc0a9d',
              },
              ':focus': {
                borderColor: '#cc0a9d',
                boxShadow: '0 0 0 2px rgba(204, 10, 157, 0.2)',
              }
            }}
          />
        </Col>

        {/* Lọc theo tỉnh thành */}
        <Col xs={24} md={6}>
          <Select
            size="large"
            placeholder="Chọn địa điểm"
            value={selectedLocation}
            onChange={(value) => setSelectedLocation(value)}
            style={{
              width: '100%',
              height: '45px',
            }}
            loading={loading}
            allowClear
            suffixIcon={<EnvironmentOutlined style={{ color: '#cc0a9d' }} />}
            dropdownStyle={{ borderRadius: '8px' }}
          >
            {provinces.map((province) => (
              <Option 
                key={province.code} 
                value={province.name}
                style={{ padding: '8px 12px' }}
              >
                {province.name}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Nút lọc nâng cao */}
        <Col xs={24} md={4}>
          <Button
            type="primary"
            onClick={handleAdvancedFilter}
            size="large"
            icon={<FilterOutlined />}
            style={{
              width: '100%',
              height: '45px',
              background: 'linear-gradient(135deg, #cc0a9d 0%, #2d067d 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(204, 10, 157, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(204, 10, 157, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(204, 10, 157, 0.2)';
            }}
          >
            Lọc nâng cao
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchBar;
