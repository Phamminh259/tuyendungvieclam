import React from 'react';
import { Typography, Row, Col, Progress, Divider, Tag } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, TrophyOutlined, BookOutlined, GlobalOutlined } from '@ant-design/icons';
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

const CreativeTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <Row style={{ 
      backgroundColor: '#fff', 
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      overflow: 'hidden'
    }}>
      {/* Left Column - Personal Info */}
      <Col span={8} style={{ 
        background: 'linear-gradient(145deg, #001529 0%, #003a70 100%)',
        height: '1123px',
        padding: '40px 30px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Avatar Section - Fixed height */}
        <div style={{ marginBottom: '30px', height: '280px' }}>
          <div style={{ 
            width: '160px',
            height: '160px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '5px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 20px rgba(0,0,0,0.2)'
          }}>
            <img 
              src={candidateData?.avatar || 'https://via.placeholder.com/160'} 
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <Title level={3} style={{ color: 'white', margin: '0', fontSize: '24px', textAlign: 'center' }}>
            {candidateData?.fullName}
          </Title>
          <Text style={{ 
            color: '#1890ff',
            fontSize: '16px',
            display: 'block',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            {candidateData?.title || 'Chức danh'}
          </Text>
        </div>

        {/* Contact Info - Fixed height */}
        <div style={{ marginBottom: '25px', height: '120px' }}>
          {candidateData?.phone && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <PhoneOutlined style={{ fontSize: '16px', marginRight: '12px', color: '#1890ff' }} />
              <Text style={{ color: 'white', fontSize: '14px' }}>{candidateData.phone}</Text>
            </div>
          )}
          {candidateData?.email && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <MailOutlined style={{ fontSize: '16px', marginRight: '12px', color: '#1890ff' }} />
              <Text style={{ color: 'white', fontSize: '14px' }}>{candidateData.email}</Text>
            </div>
          )}
          {candidateData?.address && (
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <HomeOutlined style={{ fontSize: '16px', marginRight: '12px', color: '#1890ff' }} />
              <Text style={{ color: 'white', fontSize: '14px' }}>{candidateData.address}</Text>
            </div>
          )}
        </div>

        <Divider style={{ borderColor: '#1890ff', margin: '20px 0' }} />

        {/* Skills Section - Scrollable */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
            <TrophyOutlined style={{ marginRight: '10px', color: '#1890ff' }} />
            KỸ NĂNG
          </Title>
          {skills.slice(0, 8).map(skill => (
            <div key={skill.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text style={{ color: 'white', fontSize: '14px' }}>{skill.skillName}</Text>
                <Tag color={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color}>
                  {PROFICIENCY_LEVELS[skill.proficiencyLevel]?.label}
                </Tag>
              </div>
              <Progress 
                percent={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.percent}
                strokeColor={PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color}
                showInfo={false}
                strokeWidth={4}
                trailColor="rgba(255,255,255,0.1)"
              />
            </div>
          ))}
        </div>
      </Col>

      {/* Right Column */}
      <Col span={16} style={{ 
        padding: '40px', 
        height: '1123px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* About Section - Fixed height */}
        <div style={{ marginBottom: '30px', height: '200px' }}>
          <Title level={3} style={{ color: '#001529', marginBottom: '20px' }}>
            GIỚI THIỆU
          </Title>
          <div 
            className="ql-editor"
            dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
            style={{ fontSize: '14px', lineHeight: '1.6', maxHeight: '140px', overflow: 'hidden' }}
          />
        </div>

        <Divider style={{ margin: '20px 0' }} />

        {/* Work Experience - Scrollable */}
        <div style={{ flex: 1, overflow: 'auto', marginBottom: '30px' }}>
          <Title level={3} style={{ color: '#001529', marginBottom: '20px' }}>
            KINH NGHIỆM LÀM VIỆC
          </Title>
          {workHistory.slice(0, 4).map(work => (
            <div key={work.id} style={{ marginBottom: '25px' }}>
              <Title level={4} style={{ color: '#1890ff', margin: '0', fontSize: '18px' }}>
                {work.position}
              </Title>
              <Text strong style={{ fontSize: '16px', display: 'block', margin: '8px 0' }}>
                {work.companyName}
              </Text>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {new Date(work.startDate).toLocaleDateString('vi-VN')} - 
                {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
              </Text>
              <div 
                className="ql-editor"
                dangerouslySetInnerHTML={sanitizeHTML(work.description)}
                style={{ marginTop: '12px', fontSize: '14px', lineHeight: '1.6', maxHeight: '80px', overflow: 'hidden' }}
              />
            </div>
          ))}
        </div>

        <Divider style={{ margin: '20px 0' }} />

        {/* Education - Fixed height */}
        <div style={{ height: '200px' }}>
          <Title level={3} style={{ color: '#001529', marginBottom: '20px' }}>
            <BookOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            HỌC VẤN
          </Title>
          <Title level={4} style={{ margin: '0', fontSize: '18px' }}>
            {candidateData?.educationLevel}
          </Title>
          <div 
            className="ql-editor"
            dangerouslySetInnerHTML={sanitizeHTML(candidateData?.educationDescription)}
            style={{ marginTop: '12px', fontSize: '14px', lineHeight: '1.6', maxHeight: '100px', overflow: 'hidden' }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default CreativeTemplate; 