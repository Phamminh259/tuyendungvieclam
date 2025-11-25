import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar, Typography, Row, Col, Space, Divider, Pagination } from 'antd';
import { EnvironmentOutlined, GlobalOutlined, BellOutlined, HeartOutlined, DollarOutlined } from '@ant-design/icons';
import { getAllJobs } from '../../../api/jobApi';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const CompanyJobs = ({ companyId }) => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchCompanyJobs = async () => {
            try {
                const allJobs = await getAllJobs();
                const activeJobs = allJobs.filter(job => 
                    job.companyId === companyId && 
                    job.isActive && 
                    job.approved
                );
                setJobs(activeJobs);
            } catch (error) {
                console.error('Error fetching company jobs:', error);
            }
        };
        fetchCompanyJobs();
    }, [companyId]);

    // Tính toán jobs cho trang hiện tại
    const getCurrentPageJobs = () => {
        const startIndex = (currentPage - 1) * pageSize;
        return jobs.slice(startIndex, startIndex + pageSize);
    };

    return (
        <div className="mt-4 mb-4">
            <Card bordered={false} className="mb-4">
                <Title level={5} style={{ color: 'rgb(204, 10, 157)', textAlign: 'left', marginBottom: '20px' }}>
                    Danh sách việc làm đang tuyển ({jobs.length})
                </Title>
                {getCurrentPageJobs().map(job => (
                    <Link 
                        key={job.id} 
                        to={`/jobDetail/${job.id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Card 
                            hoverable 
                            style={{ marginBottom: '10px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                                        {job.title}
                                    </Text>
                                    <Space>
                                        <DollarOutlined style={{ color: 'rgb(204, 10, 157)' }} />
                                        <Text>
                                            {new Intl.NumberFormat('vi-VN', { 
                                                style: 'currency', 
                                                currency: 'VND' 
                                            }).format(job.salary)}
                                        </Text>
                                    </Space>
                                </div>
                                <div>
                                    <Text type="secondary">
                                        Hạn nộp: {new Date(job.expiryDate).toLocaleDateString('vi-VN')}
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}

                {jobs.length > pageSize && (
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Pagination
                            current={currentPage}
                            total={jobs.length}
                            pageSize={pageSize}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            style={{ alignItems: 'center', justifyContent: 'end' }}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

const CompanyDetailComponents = ({ company }) => {
    return (
        <div className="container-fluid text-center mt-4 d-flex justify-content-center">
            <div className="row w-100" style={{ maxWidth: '1200px' }}>
                <div className="col-md-8">
                    <CompanyDetailInfo company={company} />
                    <CompanyDescription company={company} />
                    <CompanyJobs companyId={company.id} />
                </div>
                <div className="col-md-4">
                    <CompanyMedia company={company} />
                </div>
            </div>
        </div>
    );
};

const CompanyDetailInfo = ({ company }) => {
    return (
        <div className="container mt-4">
            <Card
                cover={
                    <img 
                        alt="Company Background"
                        src={company.companyLogo || "https://via.placeholder.com/1200x400"}
                        style={{ height: '250px', objectFit: 'cover' }}
                    />
                }
                bordered={false}
                style={{ borderRadius: '8px', overflow: 'hidden' }}
            >
                <Row gutter={[16, 16]} align="middle" style={{ marginTop: '-50px' }}>
                    <Col>
                        <Avatar
                            src={company.companyLogo || "https://via.placeholder.com/104"}
                            size={120}
                            style={{
                                borderRadius: '8px', 
                                border: '5px solid white',
                                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                                width: '120px',
                                height: '120px',
                            }}
                        />
                    </Col>
                    <Col style={{paddingTop: '30px'}}>
                        <Title level={3} style={{ margin: 0, textAlign: 'left'}}>
                            {company.companyName}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                            <EnvironmentOutlined style={{ marginRight: '8px' }} />
                            {company.companyAddress}
                        </Text>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

const CompanyDescription = ({ company }) => {
    return (
        <div className="mt-4 mb-4">
            <Card bordered={false} className="mb-4">
                <Title level={5} style={{ color: 'rgb(204, 10, 157)', textAlign: 'left' }}>Về công ty</Title>
                <Text style={{ textAlign: 'left', display: 'block' }}>{company.companyDescription}</Text>
            </Card>
        </div>
    );
};

const CompanyMedia = ({ company }) => {
    return (
        <Card bordered={false} className="mt-4">
            <Title level={5} style={{ color: 'rgb(204, 10, 157)' }}>Website</Title>
            <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">
                <Space>
                    <GlobalOutlined style={{color: 'rgb(204, 10, 157)'}}/>
                    <Text>{company.companyWebsite}</Text>
                </Space>
            </a>
            
            <Divider />
            
            <Title level={5} style={{ color: 'rgb(204, 10, 157)' }}>Địa chỉ công ty</Title>
            <Text>{company.companyAddress}</Text>
            <iframe
                title="Company Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(company.companyAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="200"
                style={{
                    border: 0,
                    borderRadius: '8px',
                    marginTop: '10px'
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />

            <Divider />
            
            <Title level={5} style={{ color: 'rgb(204, 10, 157)' }}>Thông tin liên hệ</Title>
            <div>
                <Text>{company.contactName} - {company.contactPosition}</Text>
            </div>
            <div>
                <Text>{company.contactPhone}</Text>
            </div>
            <div>
                <Text>{company.contactEmail}</Text>
            </div>
        </Card>
    );
};

CompanyDetailComponents.propTypes = {
    company: PropTypes.object.isRequired,
};

export { CompanyDetailComponents };