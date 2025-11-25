import React, { useState, useEffect } from 'react';
import { Select, Button, Typography, Popconfirm, Space, Input, Row, Col } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  BookOutlined,
  FilterOutlined,
  CalendarOutlined,
  ToolOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { getAllIndustries } from '../../../api/industryApi';
import { getAllProfessions } from '../../../api/professionApi';
import PropTypes from 'prop-types';

const { Option } = Select;

const FilterJobs = ({ onFiltersChange }) => {
  const location = useLocation();
  const selectedLocation = location.state?.selectedLocation;
  
  const [filters, setFilters] = useState({
    searchText: '',
    industry: undefined,
    profession: undefined,
    level: undefined,
    experience: undefined,
    salary: undefined,
    education: undefined,
    jobType: undefined,
    postedDate: undefined,
    location: selectedLocation || undefined,
  });

  const [provinces, setProvinces] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      setFilters(prev => ({
        ...prev,
        location: selectedLocation
      }));
    }
  }, [selectedLocation]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [provincesData, industriesData, professionsData] = await Promise.all([
          axios.get('https://provinces.open-api.vn/api/p/'),
          getAllIndustries(),
          getAllProfessions()
        ]);
        
        setProvinces(provincesData.data);
        setIndustries(industriesData);
        setProfessions(professionsData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetAllFilters = () => {
    setFilters({
      searchText: '',
      industry: undefined,
      profession: undefined,
      level: undefined,
      experience: undefined,
      salary: undefined,
      education: undefined,
      jobType: undefined,
      postedDate: undefined,
      location: undefined,
    });
  };

  const dropdownStyle = {
    width: 180,
    height: '40px',
    color: 'black',
  };

  // Add effect to trigger filter changes
  useEffect(() => {
    if (typeof onFiltersChange === 'function') {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #020024, #cc0a9d)',
        padding: '20px',
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* Search Bar Section */}
      <Row gutter={[16, 16]} justify="center" align="middle" style={{ marginBottom: '20px' }}>
        <Col xs={24} md={10}>
          <Input
            placeholder="Tìm kiếm cơ hội việc làm"
            value={filters.searchText}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
            style={{
              height: '40px',
              borderRadius: '5px',
              width: '100%',
            }}
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Lọc theo nghề nghiệp"
            value={filters.profession}
            onChange={(value) => setFilters({ ...filters, profession: value })}
            style={{ width: '100%', height: '40px' }}
            loading={loading}
            allowClear
          >
            {professions.map((profession) => (
              <Option key={profession.id} value={profession.name}>
                {profession.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Lọc theo tỉnh thành"
            value={filters.location}
            onChange={(value) => setFilters({ ...filters, location: value })}
            style={{ width: '100%', height: '40px' }}
            loading={loading}
            allowClear
          >
            {provinces.map((province) => (
              <Option key={province.code} value={province.name}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* Additional Filters Section */}
      <Space wrap size="middle" align="center" style={{ justifyContent: 'center', gap: '8px' }}>
        <Select
          placeholder={<><AppstoreOutlined /> Ngành nghề</>}
          value={filters.industry}
          onChange={(value) => setFilters({ ...filters, industry: value })}
          style={dropdownStyle}
          loading={loading}
          allowClear
        >
          {industries.map((industry) => (
            <Option key={industry.id} value={industry.name}>
              {industry.name}
            </Option>
          ))}
        </Select>

        {/* Existing filters remain unchanged */}
        <Select
          placeholder={<><ToolOutlined /> Cấp bậc</>}
          value={filters.level}
          onChange={(value) => setFilters({ ...filters, level: value })}
          style={dropdownStyle}
          allowClear
        >
          {[
            { value: 'INTERN', label: 'Thực tập sinh' },
            { value: 'JUNIOR', label: 'Nhân viên' },
            { value: 'SENIOR', label: 'Trưởng phòng' },
            { value: 'MANAGER', label: 'Quản lý' },
            { value: 'DIRECTOR', label: 'Giám đốc' }
          ].map((level) => (
            <Option key={level.value} value={level.value}>
              {level.label}
            </Option>
          ))}
        </Select>

        <Select
          placeholder={<><ClockCircleOutlined /> Kinh nghiệm</>}
          value={filters.experience}
          onChange={(value) => setFilters({ ...filters, experience: value })}
          style={dropdownStyle}
          allowClear
        >
          {[
            { value: 'LESS_THAN_1_YEAR', label: 'Dưới 1 năm' },
            { value: 'ONE_TO_THREE_YEARS', label: '1-3 năm' },
            { value: 'THREE_TO_FIVE_YEARS', label: '3-5 năm' },
            { value: 'FIVE_TO_TEN_YEARS', label: '5-10 năm' },
            { value: 'MORE_THAN_10_YEARS', label: 'Trên 10 năm' }
          ].map((exp) => (
            <Option key={exp.value} value={exp.value}>
              {exp.label}
            </Option>
          ))}
        </Select>

        <Select
          placeholder={<><DollarOutlined /> Mức lương</>}
          value={filters.salary}
          onChange={(value) => setFilters({ ...filters, salary: value })}
          style={dropdownStyle}
          allowClear
        >
          {[
            { value: 5000000, label: 'Dưới 5 triệu' },
            { value: 10000000, label: '5-10 triệu' },
            { value: 20000000, label: '10-20 triệu' },
            { value: 50000000, label: 'Trên 20 triệu' }
          ].map((salary) => (
            <Option key={salary.value} value={salary.value}>
              {salary.label}
            </Option>
          ))}
        </Select>

        <Select
          placeholder={<><BookOutlined /> Học vấn</>}
          value={filters.education}
          onChange={(value) => setFilters({ ...filters, education: value })}
          style={dropdownStyle}
          allowClear
        >
          {[
            { value: 'HIGH_SCHOOL', label: 'THPT' },
            { value: 'COLLEGE', label: 'Cao đẳng' },
            { value: 'UNIVERSITY', label: 'Đại học' },
            { value: 'MASTER', label: 'Thạc sĩ' },
            { value: 'DOCTOR', label: 'Tiến sĩ' }
          ].map((edu) => (
            <Option key={edu.value} value={edu.value}>
              {edu.label}
            </Option>
          ))}
        </Select>

        <Select
          placeholder={<><FilterOutlined /> Loại công việc</>}
          value={filters.jobType}
          onChange={(value) => setFilters({ ...filters, jobType: value })}
          style={dropdownStyle}
          allowClear
        >
          {[
            { value: 'FULL_TIME', label: 'Toàn thời gian' },
            { value: 'PART_TIME', label: 'Bán thời gian' },
            { value: 'SEASONAL', label: 'Thời vụ' }
          ].map((type) => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>

        <Select
          placeholder={<><CalendarOutlined /> Đăng trong</>}
          value={filters.postedDate}
          onChange={(value) => setFilters({ ...filters, postedDate: value })}
          style={dropdownStyle}
          allowClear
        >
          {['Hôm nay', '3 ngày', '1 tuần', '2 tuần', '1 tháng'].map((date) => (
            <Option key={date} value={date}>
              {date}
            </Option>
          ))}
        </Select>

        <Popconfirm
          title="Bạn có chắc chắn muốn xóa tất cả bộ lọc không?"
          onConfirm={resetAllFilters}
          okText="Có"
          cancelText="Không"
        >
          <Button
            danger
            icon={<CloseCircleOutlined />}
            style={{
              height: '40px',
            }}
          >
            Xóa bộ lọc
          </Button>
        </Popconfirm>
      </Space>
    </div>
  );
};

FilterJobs.propTypes = {
  onFiltersChange: PropTypes.func.isRequired
};

export default FilterJobs;
