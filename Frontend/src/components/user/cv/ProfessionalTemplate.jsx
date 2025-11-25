import React from 'react';
import { Typography, Row, Col, Progress, Tag } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text } = Typography;

const PROFICIENCY_LEVELS = {
  BEGINNER: { label: 'Cơ bản', color: '#69c0ff', percent: 33 },
  INTERMEDIATE: { label: 'Trung bình', color: '#40a9ff', percent: 66 },
  ADVANCED: { label: 'Nâng cao', color: '#1890ff', percent: 100 },
  EXPERT: { label: 'Chuyên gia', color: '#096dd9', percent: 100 }
};

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html || '') };
};

const ProfessionalTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{ 
      backgroundColor: '#fff',
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '40px' }}>
        <Row gutter={[40, 40]}>
          {/* Header Section - Fixed height */}
          <Col span={24}>
            <Row align="middle" gutter={24}>
              <Col>
                <div style={{ 
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid #fff',
                  boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={candidateData?.avatar || 'https://via.placeholder.com/150'} 
                    alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </Col>
              <Col flex="1">
                <Title style={{ 
                  color: '#fff',
                  margin: '0 0 8px',
                  fontSize: '32px',
                  fontWeight: '500'
                }}>
                  {candidateData?.fullName}
                </Title>
                <Title level={3} style={{ 
                  color: '#fff',
                  margin: '0 0 16px',
                  fontWeight: '400',
                  opacity: 0.9,
                  fontSize: '20px'
                }}>
                  {candidateData?.title || 'Chức danh'}
                </Title>
                <Row gutter={16}>
                  {candidateData?.phone && (
                    <Col>
                      <Text style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                        <PhoneOutlined style={{ marginRight: '8px' }} />
                        {candidateData.phone}
                      </Text>
                    </Col>
                  )}
                  {candidateData?.email && (
                    <Col>
                      <Text style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                        <MailOutlined style={{ marginRight: '8px' }} />
                        {candidateData.email}
                      </Text>
                    </Col>
                  )}
                  {candidateData?.address && (
                    <Col>
                      <Text style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                        <HomeOutlined style={{ marginRight: '8px' }} />
                        {candidateData.address}
                      </Text>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>

          {/* Main Content */}
          <Col span={24}>
            <Row gutter={[40, 40]}>
              {/* Left Column */}
              <Col span={16}>
                {/* About Section - Fixed height */}
                <div style={{ marginBottom: '40px', height: '180px' }}>
                  <Title level={4} style={{ 
                    color: '#1890ff',
                    borderBottom: '2px solid #1890ff',
                    paddingBottom: '8px',
                    marginBottom: '20px'
                  }}>
                    GIỚI THIỆU
                  </Title>
                  <div 
                    className="ql-editor"
                    dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
                    style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      color: '#595959',
                      maxHeight: '120px',
                      overflow: 'hidden'
                    }}
                  />
                </div>

                {/* Work Experience - Scrollable */}
                <div style={{ marginBottom: '40px', maxHeight: '350px', overflow: 'auto' }}>
                  <Title level={4} style={{ 
                    color: '#1890ff',
                    borderBottom: '2px solid #1890ff',
                    paddingBottom: '8px',
                    marginBottom: '20px'
                  }}>
                    KINH NGHIỆM LÀM VIỆC
                  </Title>
                  {workHistory.slice(0, 4).map((work, index) => (
                    <div key={work.id} style={{ 
                      marginBottom: '25px',
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
                        backgroundColor: '#1890ff'
                      }} />
                      <Title level={5} style={{ margin: '0 0 5px' }}>
                        {work.position}
                      </Title>
                      <Text strong style={{ display: 'block', marginBottom: '5px', color: '#1890ff' }}>
                        {work.companyName}
                      </Text>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '10px', fontSize: '12px' }}>
                        {new Date(work.startDate).toLocaleDateString('vi-VN')} - 
                        {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                      </Text>
                      <div 
                        className="ql-editor"
                        dangerouslySetInnerHTML={sanitizeHTML(work.description)}
                        style={{ 
                          fontSize: '14px', 
                          lineHeight: '1.6',
                          color: '#595959',
                          maxHeight: '80px',
                          overflow: 'hidden'
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Education - Fixed height */}
                <div style={{ height: '160px' }}>
                  <Title level={4} style={{ 
                    color: '#1890ff',
                    borderBottom: '2px solid #1890ff',
                    paddingBottom: '8px',
                    marginBottom: '20px'
                  }}>
                    HỌC VẤN
                  </Title>
                  <Title level={5} style={{ margin: '0 0 10px' }}>
                    {candidateData?.educationLevel}
                  </Title>
                  <div 
                    className="ql-editor"
                    dangerouslySetInnerHTML={sanitizeHTML(candidateData?.educationDescription)}
                    style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      color: '#595959',
                      maxHeight: '80px',
                      overflow: 'hidden'
                    }}
                  />
                </div>
              </Col>

              {/* Right Column - Skills */}
              <Col span={8}>
                <Title level={4} style={{ 
                  color: '#1890ff',
                  borderBottom: '2px solid #1890ff',
                  paddingBottom: '8px',
                  marginBottom: '20px'
                }}>
                  KỸ NĂNG
                </Title>
                <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                  {skills.slice(0, 8).map(skill => (
                    <div key={skill.id} style={{ marginBottom: '25px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '8px' 
                      }}>
                        <Text strong>{skill.skillName}</Text>
                        <Text type="secondary">{PROFICIENCY_LEVELS[skill.proficiencyLevel]?.label}</Text>
                      </div>
                      <Progress 
                        percent={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.percent}
                        strokeColor={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfessionalTemplate; 