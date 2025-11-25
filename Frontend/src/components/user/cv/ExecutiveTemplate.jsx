import React from 'react';
import { Typography, Row, Col, Tag, Divider } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, GlobalOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text } = Typography;

const PROFICIENCY_LEVELS = {
  BEGINNER: { label: 'Cơ bản', color: '#d4b106' },
  INTERMEDIATE: { label: 'Trung bình', color: '#d48806' },
  ADVANCED: { label: 'Nâng cao', color: '#d46b08' },
  EXPERT: { label: 'Chuyên gia', color: '#d4380d' }
};

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html || '') };
};

const ExecutiveTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{ 
      backgroundColor: '#fff',
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Roboto', 'Noto Serif', serif"
    }}>
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '12px',
        background: 'linear-gradient(90deg, #d4b106 0%, #d48806 50%, #d4380d 100%)'
      }} />
      
      {/* Main Content */}
      <div style={{ padding: '50px 45px' }}>
        {/* Header - Fixed height */}
        <Row gutter={[40, 40]} align="middle" style={{ height: '180px' }}>
          <Col span={16}>
            <Title style={{ 
              fontSize: '38px',
              margin: '0',
              fontFamily: "'Roboto', 'Noto Serif', serif",
              color: '#262626',
              letterSpacing: '0.5px',
              fontWeight: 500
            }}>
              {candidateData?.fullName}
            </Title>
            <Title level={3} style={{ 
              margin: '8px 0 0',
              color: '#d48806',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: '22px'
            }}>
              {candidateData?.title || 'Chức danh'}
            </Title>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <div style={{ 
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 0 0 auto',
              border: '3px solid #d48806',
              boxShadow: '0 4px 12px rgba(212, 136, 6, 0.2)'
            }}>
              <img 
                src={candidateData?.avatar || 'https://via.placeholder.com/140'} 
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </Col>
        </Row>

        {/* Contact Information - Fixed height with better spacing */}
        <Row style={{ 
          marginTop: '25px',
          padding: '18px 25px',
          background: '#fafafa',
          border: '1px solid #f0f0f0',
          borderRadius: '6px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {candidateData?.phone && (
            <Col span={7}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PhoneOutlined style={{ 
                  color: '#d48806', 
                  marginRight: '10px', 
                  fontSize: '16px' 
                }} />
                <Text style={{ 
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}>
                  {candidateData.phone}
                </Text>
              </div>
            </Col>
          )}
          {candidateData?.email && (
            <Col span={10}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MailOutlined style={{ 
                  color: '#d48806', 
                  marginRight: '10px', 
                  fontSize: '16px' 
                }} />
                <Text style={{ 
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}>
                  {candidateData.email}
                </Text>
              </div>
            </Col>
          )}
          {candidateData?.address && (
            <Col span={7}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <HomeOutlined style={{ 
                  color: '#d48806', 
                  marginRight: '10px', 
                  fontSize: '16px' 
                }} />
                <Text style={{ 
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}>
                  {candidateData.address}
                </Text>
              </div>
            </Col>
          )}
        </Row>

        {/* Professional Summary - Fixed height */}
        <div style={{ marginTop: '35px', height: '180px' }}>
          <Title level={3} style={{ 
            color: '#262626',
            borderBottom: '2px solid #d48806',
            paddingBottom: '10px',
            fontFamily: "'Roboto', 'Noto Serif', serif",
            fontSize: '20px',
            letterSpacing: '1px'
          }}>
            GIỚI THIỆU
          </Title>
          <div 
            className="ql-editor"
            dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
            style={{ 
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#595959',
              fontStyle: 'italic',
              maxHeight: '120px',
              overflow: 'hidden'
            }}
          />
        </div>

        <Row gutter={[60, 0]} style={{ marginTop: '35px' }}>
          {/* Left Column */}
          <Col span={16}>
            {/* Work Experience - Scrollable */}
            <div style={{ marginBottom: '35px', maxHeight: '380px', overflow: 'auto' }}>
              <Title level={3} style={{ 
                color: '#262626',
                borderBottom: '2px solid #d48806',
                paddingBottom: '10px',
                fontFamily: "'Roboto', 'Noto Serif', serif",
                fontSize: '20px',
                letterSpacing: '1px'
              }}>
                KINH NGHIỆM LÀM VIỆC
              </Title>
              {workHistory.slice(0, 4).map((work, index) => (
                <div key={work.id} style={{ 
                  marginBottom: '25px',
                  position: 'relative',
                  paddingLeft: '25px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '10px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#d48806',
                    transform: 'rotate(45deg)'
                  }} />
                  <Title level={4} style={{ 
                    margin: '0 0 5px',
                    color: '#262626',
                    fontFamily: "'Roboto', 'Noto Serif', serif",
                    fontSize: '18px'
                  }}>
                    {work.position}
                  </Title>
                  <Text strong style={{ 
                    display: 'block',
                    marginBottom: '5px',
                    color: '#d48806',
                    fontSize: '15px'
                  }}>
                    {work.companyName}
                  </Text>
                  <Text type="secondary" style={{ 
                    display: 'block',
                    marginBottom: '12px',
                    fontStyle: 'italic',
                    fontSize: '13px'
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
                      maxHeight: '80px',
                      overflow: 'hidden',
                      color: '#595959'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Education - Fixed height */}
            <div style={{ height: '160px' }}>
              <Title level={3} style={{ 
                color: '#262626',
                borderBottom: '2px solid #d48806',
                paddingBottom: '10px',
                fontFamily: "'Roboto', 'Noto Serif', serif",
                fontSize: '20px',
                letterSpacing: '1px'
              }}>
                HỌC VẤN
              </Title>
              <Title level={4} style={{ 
                margin: '15px 0 10px',
                color: '#262626',
                fontFamily: "'Roboto', 'Noto Serif', serif",
                fontSize: '16px'
              }}>
                {candidateData?.educationLevel}
              </Title>
              <div 
                className="ql-editor"
                dangerouslySetInnerHTML={sanitizeHTML(candidateData?.educationDescription)}
                style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  maxHeight: '80px',
                  overflow: 'hidden',
                  color: '#595959'
                }}
              />
            </div>
          </Col>

          {/* Right Column - Skills */}
          <Col span={8}>
            <Title level={3} style={{ 
              color: '#262626',
              borderBottom: '2px solid #d48806',
              paddingBottom: '10px',
              fontFamily: "'Roboto', 'Noto Serif', serif",
              fontSize: '20px',
              letterSpacing: '1px'
            }}>
              KỸ NĂNG
            </Title>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginTop: '20px',
              maxHeight: '500px',
              overflow: 'auto'
            }}>
              {skills.slice(0, 8).map(skill => (
                <div key={skill.id} style={{
                  padding: '15px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  background: '#fafafa',
                  transition: 'all 0.3s ease'
                }}>
                  <Text strong style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    color: '#262626',
                    fontSize: '14px'
                  }}>
                    {skill.skillName}
                  </Text>
                  <Tag color={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color}>
                    {PROFICIENCY_LEVELS[skill.proficiencyLevel]?.label}
                  </Tag>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>

      {/* Footer Decorative Element */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '12px',
        background: 'linear-gradient(90deg, #d4b106 0%, #d48806 50%, #d4380d 100%)'
      }} />
    </div>
  );
};

export default ExecutiveTemplate; 