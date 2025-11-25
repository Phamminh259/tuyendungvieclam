import React from 'react';
import { Typography, Row, Col, Progress } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text } = Typography;

const PROFICIENCY_LEVELS = {
  BEGINNER: { label: 'Cơ bản', percent: 25 },
  INTERMEDIATE: { label: 'Trung bình', percent: 50 },
  ADVANCED: { label: 'Nâng cao', percent: 75 },
  EXPERT: { label: 'Chuyên gia', percent: 100 }
};

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html || '') };
};

const MinimalModernTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      background: '#ffffff',
      padding: '60px 50px',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Section */}
      <Row gutter={[40, 0]} style={{ marginBottom: '50px' }}>
        <Col span={16}>
          <Title style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#111827',
            letterSpacing: '-1px'
          }}>
            {candidateData?.fullName}
          </Title>
          <Title level={3} style={{
            fontSize: '24px',
            fontWeight: '500',
            color: '#4B5563',
            margin: '0 0 20px',
            letterSpacing: '-0.5px'
          }}>
            {candidateData?.title || 'Chức danh'}
          </Title>
          <div style={{
            display: 'flex',
            gap: '20px',
            color: '#6B7280',
            fontSize: '14px'
          }}>
            {candidateData?.phone && (
              <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneOutlined /> {candidateData.phone}
              </Text>
            )}
            {candidateData?.email && (
              <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MailOutlined /> {candidateData.email}
              </Text>
            )}
            {candidateData?.address && (
              <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HomeOutlined /> {candidateData.address}
              </Text>
            )}
          </div>
        </Col>
        <Col span={8}>
          <div style={{
            width: '180px',
            height: '180px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            float: 'right'
          }}>
            <img
              src={candidateData?.avatar || 'https://via.placeholder.com/180'}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[40, 0]}>
        <Col span={16}>
          {/* About Section */}
          <div style={{ marginBottom: '40px' }}>
            <Title level={4} style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '16px'
            }}>
              Giới thiệu
            </Title>
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
              style={{
                fontSize: '15px',
                lineHeight: '1.8',
                color: '#4B5563',
                maxHeight: '120px',
                overflow: 'hidden'
              }}
            />
          </div>

          {/* Experience Section */}
          <div style={{ marginBottom: '40px' }}>
            <Title level={4} style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '16px'
            }}>
              Kinh nghiệm làm việc
            </Title>
            {workHistory.slice(0, 4).map(work => (
              <div key={work.id} style={{ marginBottom: '24px' }}>
                <Title level={5} style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {work.position}
                </Title>
                <Text strong style={{
                  display: 'block',
                  color: '#4B5563',
                  marginBottom: '4px'
                }}>
                  {work.companyName}
                </Text>
                <Text style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  {new Date(work.startDate).toLocaleDateString('vi-VN')} -
                  {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                </Text>
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={sanitizeHTML(work.description)}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#4B5563',
                    maxHeight: '80px',
                    overflow: 'hidden'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div>
            <Title level={4} style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '16px'
            }}>
              Học vấn
            </Title>
            <Title level={5} style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              {candidateData?.educationLevel}
            </Title>
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={sanitizeHTML(candidateData?.educationDescription)}
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#4B5563',
                maxHeight: '100px',
                overflow: 'hidden'
              }}
            />
          </div>
        </Col>

        {/* Skills Section */}
        <Col span={8}>
          <Title level={4} style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '16px'
          }}>
            Kỹ năng
          </Title>
          <div style={{ maxHeight: '600px', overflow: 'auto' }}>
            {skills.slice(0, 8).map(skill => (
              <div key={skill.id} style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <Text strong style={{ color: '#111827' }}>
                    {skill.skillName}
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: '14px' }}>
                    {PROFICIENCY_LEVELS[skill.proficiencyLevel]?.label}
                  </Text>
                </div>
                <Progress
                  percent={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.percent}
                  strokeColor={{
                    '0%': '#9CA3AF',
                    '100%': '#111827'
                  }}
                  showInfo={false}
                  size="small"
                  strokeWidth={4}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MinimalModernTemplate; 