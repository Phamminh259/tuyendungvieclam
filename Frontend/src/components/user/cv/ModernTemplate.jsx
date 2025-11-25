import React from 'react';
import { Typography, Divider, Row, Col, Tag, Progress } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, GlobalOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text } = Typography;

const PROFICIENCY_LEVELS = {
  BEGINNER: { label: 'Cơ bản', color: '#ffd666', percent: 33 },
  INTERMEDIATE: { label: 'Trung bình', color: '#40a9ff', percent: 66 },
  ADVANCED: { label: 'Nâng cao', color: '#52c41a', percent: 100 },
  EXPERT: { label: 'Chuyên gia', color: '#722ed1', percent: 100 }
};

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html || '') };
};

const ModernTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{ 
      padding: '40px',
      backgroundColor: '#fff',
      width: '794px', // A4 width
      height: '1123px', // A4 height
      margin: '0 auto',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Section - Fixed height */}
      <div style={{ marginBottom: '30px', height: '120px' }}>
        <Row gutter={[24, 0]}>
          <Col span={16}>
            <Title level={2} style={{ margin: '0 0 10px', fontSize: '32px' }}>
              {candidateData?.fullName}
            </Title>
            <Title level={3} style={{ 
              color: '#595959', 
              fontWeight: 'normal', 
              margin: 0,
              fontSize: '20px' 
            }}>
              {candidateData?.title || 'Chức danh'}
            </Title>
          </Col>
          <Col span={8}>
            <div style={{ 
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <PhoneOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text>{candidateData?.phone}</Text>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text>{candidateData?.email}</Text>
              </div>
              <div>
                <HomeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text>{candidateData?.address}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Main Content - Scrollable with max height */}
      <Row gutter={[40, 0]} style={{ flex: 1, maxHeight: 'calc(1123px - 200px)' }}>
        {/* Left Column */}
        <Col span={16}>
          {/* Professional Summary */}
          <div style={{ marginBottom: '30px' }}>
            <Title level={4} style={{ color: '#1890ff', marginBottom: '15px' }}>
              GIỚI THIỆU
            </Title>
            <div 
              className="ql-editor"
              dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
              style={{ fontSize: '14px', lineHeight: '1.6' }}
            />
          </div>

          {/* Work Experience */}
          <div style={{ marginBottom: '30px' }}>
            <Title level={4} style={{ color: '#1890ff', marginBottom: '15px' }}>
              KINH NGHIỆM LÀM VIỆC
            </Title>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {workHistory.slice(0, 4).map(work => ( // Giới hạn hiển thị 4 công việc
                <div key={work.id} style={{ marginBottom: '20px' }}>
                  <Title level={5} style={{ margin: '0 0 5px' }}>
                    {work.position}
                  </Title>
                  <Text strong>{work.companyName}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(work.startDate).toLocaleDateString('vi-VN')} - 
                    {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                  </Text>
                  <div 
                    className="ql-editor"
                    dangerouslySetInnerHTML={sanitizeHTML(work.description)}
                    style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.4',
                      maxHeight: '80px',
                      overflow: 'hidden'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <Title level={4} style={{ color: '#1890ff', marginBottom: '15px' }}>
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
                lineHeight: '1.4',
                maxHeight: '100px',
                overflow: 'hidden'
              }}
            />
          </div>
        </Col>

        {/* Right Column - Skills */}
        <Col span={8}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '15px' }}>
            KỸ NĂNG
          </Title>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {skills.slice(0, 8).map(skill => ( // Giới hạn hiển thị 8 kỹ năng
              <div key={skill.id} style={{ marginBottom: '15px' }}>
                <Text strong>{skill.skillName}</Text>
                <Progress 
                  percent={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.percent}
                  size="small"
                  showInfo={false}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ModernTemplate; 