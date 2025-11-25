import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, GlobalOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text } = Typography;

const PROFICIENCY_LEVELS = {
  BEGINNER: { label: 'Cơ bản', color: '#91caff' },
  INTERMEDIATE: { label: 'Trung bình', color: '#69b1ff' },
  ADVANCED: { label: 'Nâng cao', color: '#4096ff' },
  EXPERT: { label: 'Chuyên gia', color: '#0958d9' }
};

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html || '') };
};

const ElegantTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#fff',
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      fontFamily: 'Playfair Display, serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(135deg, #f6f8fc 0%, #e9f0f8 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)',
        zIndex: 1
      }} />

      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header Section */}
        <Row gutter={[24, 0]} style={{ marginBottom: '40px' }}>
          <Col span={16}>
            <Title style={{
              fontSize: '38px',
              fontFamily: 'Playfair Display, serif',
              marginBottom: '10px',
              color: '#1e293b'
            }}>
              {candidateData?.fullName}
            </Title>
            <Title level={3} style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              color: '#64748b',
              margin: 0
            }}>
              {candidateData?.title || 'Chức danh'}
            </Title>
          </Col>
          <Col span={8}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '14px'
            }}>
              {candidateData?.phone && (
                <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneOutlined style={{ color: '#0958d9' }} />
                  {candidateData.phone}
                </Text>
              )}
              {candidateData?.email && (
                <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MailOutlined style={{ color: '#0958d9' }} />
                  {candidateData.email}
                </Text>
              )}
              {candidateData?.address && (
                <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HomeOutlined style={{ color: '#0958d9' }} />
                  {candidateData.address}
                </Text>
              )}
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[40, 0]}>
          <Col span={16}>
            {/* Professional Summary */}
            <div style={{ marginBottom: '30px' }}>
              <Title level={4} style={{
                color: '#1e293b',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '8px',
                fontFamily: 'Playfair Display, serif'
              }}>
                GIỚI THIỆU
              </Title>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#475569'
                }}
              />
            </div>

            {/* Work Experience */}
            <div style={{ marginBottom: '30px' }}>
              <Title level={4} style={{
                color: '#1e293b',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '8px',
                fontFamily: 'Playfair Display, serif'
              }}>
                KINH NGHIỆM LÀM VIỆC
              </Title>
              {workHistory.slice(0, 4).map(work => (
                <div key={work.id} style={{ marginBottom: '25px' }}>
                  <Title level={5} style={{
                    margin: '0 0 5px',
                    color: '#0958d9',
                    fontSize: '16px'
                  }}>
                    {work.position}
                  </Title>
                  <Text strong style={{ color: '#64748b' }}>
                    {work.companyName}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {new Date(work.startDate).toLocaleDateString('vi-VN')} -
                    {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                  </Text>
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={sanitizeHTML(work.description)}
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#475569',
                      marginTop: '8px'
                    }}
                  />
                </div>
              ))}
            </div>
          </Col>

          <Col span={8}>
            {/* Skills Section */}
            <div style={{ marginBottom: '30px' }}>
              <Title level={4} style={{
                color: '#1e293b',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '8px',
                fontFamily: 'Playfair Display, serif'
              }}>
                KỸ NĂNG
              </Title>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '15px'
              }}>
                {skills.slice(0, 8).map(skill => (
                  <div
                    key={skill.id}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#fff',
                      backgroundColor: PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {skill.skillName}
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <Title level={4} style={{
                color: '#1e293b',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '8px',
                fontFamily: 'Playfair Display, serif'
              }}>
                HỌC VẤN
              </Title>
              <Title level={5} style={{
                margin: '15px 0 10px',
                color: '#0958d9',
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
                  color: '#475569'
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ElegantTemplate;