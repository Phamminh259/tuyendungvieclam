import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography } from 'antd';
import { getAllEmployers } from '../../../api/employerApi'; // Import API

const { Title, Text } = Typography;

const CompanyList = ({ searchTerm, selectedLocations }) => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllEmployers();
        // Lọc các công ty có trạng thái ACTIVE
        const activeCompanies = data.filter(company => company.status === 'ACTIVE');
        setCompanies(activeCompanies);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách công ty:", error);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.includes(String(company.location));
    return matchesSearch && matchesLocation;
  });

  return (
    <Row gutter={[16, 16]}>
      {filteredCompanies.map((company) => {
        return (
          <Col
            key={company.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{ marginBottom: '24px' }}
          >
            <Link to={`/companyDetail/${company.id}`} style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                cover={
                  <div className="d-flex justify-content-center" style={{ height: '150px' }}>
                    <img
                      alt="Company Logo"
                      src={company.companyLogo}
                      className="img-fluid"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                }
                className="company-card h-100"
                style={{
                  paddingTop: '16px',
                }}
              >
                <Title level={5} className="company-name text-truncate">
                  {company.companyName}
                </Title>
                <Text className="jobs-available" style={{ color: "rgb(204, 10, 157)" }}>
                  {company.totalJobs} việc đang tuyển
                </Text>
                <p
                  className="location text-muted mb-0 text-truncate"
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                  title={company.companyAddress}
                >
                  {company.companyAddress}
                </p>
              </Card>
            </Link>
          </Col>
        );
      })}
    </Row>
  );
};

CompanyList.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  selectedLocations: PropTypes.array.isRequired,
};

export default CompanyList;
