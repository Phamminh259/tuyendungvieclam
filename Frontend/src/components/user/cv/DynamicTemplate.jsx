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

const DynamicTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      background: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '250px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
      }} />

      {/* Content Container */}
      <div style={{ position: 'relative', padding: '40px' }}>
        {/* Profile Section */}
        <Row gutter={[24, 0]} align="middle" style={{ marginBottom: '40px' }}>
          <Col span={6}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '4px solid #ffffff',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
              <img
                src={candidateData?.avatar || 'https://via.placeholder.com/150'}
                alt="avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </Col>
          <Col span={18}>
            <Title style={{
              color: '#ffffff',
              margin: '0 0 8px',
              fontSize: '36px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {candidateData?.fullName}
            </Title>
            <Title level={3} style={{
              color: '#ffffff',
              margin: '0 0 16px',
              fontWeight: 400,
              opacity: 0.9
            }}>
              {candidateData?.title || 'Chức danh'}
            </Title>
            <Row gutter={16}>
              {candidateData?.phone && (
                <Col>
                  <Text style={{
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <PhoneOutlined /> {candidateData.phone}
                  </Text>
                </Col>
              )}
              {candidateData?.email && (
                <Col>
                  <Text style={{
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <MailOutlined /> {candidateData.email}
                  </Text>
                </Col>
              )}
              {candidateData?.address && (
                <Col>
                  <Text style={{
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <HomeOutlined /> {candidateData.address}
                  </Text>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[40, 0]} style={{ marginTop: '40px' }}>
          <Col span={16}>
            {/* Professional Summary */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Title level={4} style={{
                color: '#667eea',
                marginBottom: '16px'
              }}>
                GIỚI THIỆU
              </Title>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#4a5568'
                }}
              />
            </div>

            {/* Work Experience */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Title level={4} style={{
                color: '#667eea',
                marginBottom: '16px'
              }}>
                KINH NGHIỆM LÀM VIỆC
              </Title>
              {workHistory.slice(0, 4).map(work => (
                <div key={work.id} style={{
                  marginBottom: '24px',
                  position: 'relative',
                  paddingLeft: '20px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#667eea'
                  }} />
                  <Title level={5} style={{
                    margin: '0 0 8px',
                    color: '#2d3748'
                  }}>
                    {work.position}
                  </Title>
                  <Text strong style={{
                    color: '#667eea',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    {work.companyName}
                  </Text>
                  <Text type="secondary" style={{
                    fontSize: '12px',
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
                      color: '#4a5568'
                    }}
                  />
                </div>
              ))}
            </div>
          </Col>

          <Col span={8}>
            {/* Skills Section */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Title level={4} style={{
                color: '#667eea',
                marginBottom: '16px'
              }}>
                KỸ NĂNG
              </Title>
              {skills.slice(0, 8).map(skill => (
                <div key={skill.id} style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <Text strong>{skill.skillName}</Text>
                    <Text>{PROFICIENCY_LEVELS[skill.proficiencyLevel]?.label}</Text>
                  </div>
                  <Progress
                    percent={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.percent}
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2'
                    }}
                    showInfo={false}
                    size="small"
                  />
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Title level={4} style={{
                color: '#667eea',
                marginBottom: '16px'
              }}>
                HỌC VẤN
              </Title>
              <Title level={5} style={{
                margin: '0 0 8px',
                color: '#2d3748'
              }}>
                {candidateData?.educationLevel}
              </Title>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={sanitizeHTML(candidateData?.educationDescription)}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#4a5568'
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DynamicTemplate;
