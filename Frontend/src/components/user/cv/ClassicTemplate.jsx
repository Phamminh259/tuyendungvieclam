import React from 'react';
import { Typography, Divider, Space } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, GlobalOutlined, BookOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text } = Typography;

const PROFICIENCY_LEVELS = {
  BEGINNER: { label: 'Cơ bản', color: '#8c8c8c' },
  INTERMEDIATE: { label: 'Trung bình', color: '#595959' },
  ADVANCED: { label: 'Nâng cao', color: '#262626' },
  EXPERT: { label: 'Chuyên gia', color: '#000000' }
};

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html || '') };
};

const ClassicTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{ 
      padding: '60px', 
      backgroundColor: '#fff',
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      fontFamily: 'Times New Roman',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header - Fixed height */}
      <div style={{ marginBottom: '30px', height: '150px' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1} style={{ 
            marginBottom: '15px',
            fontSize: '32px',
            fontFamily: 'Times New Roman',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {candidateData?.fullName}
          </Title>
          <Title level={3} style={{ 
            margin: '0 0 20px',
            fontWeight: 'normal',
            color: '#595959',
            fontFamily: 'Times New Roman',
            fontSize: '20px'
          }}>
            {candidateData?.title || 'Chức danh'}
          </Title>
          <Space size={30} wrap style={{ justifyContent: 'center' }}>
            {candidateData?.phone && (
              <Text><PhoneOutlined /> {candidateData.phone}</Text>
            )}
            {candidateData?.email && (
              <Text><MailOutlined /> {candidateData.email}</Text>
            )}
            {candidateData?.address && (
              <Text><HomeOutlined /> {candidateData.address}</Text>
            )}
          </Space>
        </div>
      </div>

      <Divider style={{ borderTop: '2px solid black', margin: '20px 0' }} />

      {/* Main Content */}
      <div style={{ flex: 1, maxHeight: 'calc(1123px - 280px)', overflow: 'auto' }}>
        {/* Professional Summary */}
        <div style={{ marginBottom: '30px' }}>
          <Title level={3} style={{ 
            fontFamily: 'Times New Roman',
            borderBottom: '1px solid #d9d9d9',
            paddingBottom: '10px',
            fontSize: '20px'
          }}>
            MỤC TIÊU NGHỀ NGHIỆP
          </Title>
          <div 
            className="ql-editor"
            dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
            style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              maxHeight: '120px',
              overflow: 'hidden'
            }}
          />
        </div>

        {/* Work Experience */}
        <div style={{ marginBottom: '30px' }}>
          <Title level={3} style={{ 
            fontFamily: 'Times New Roman',
            borderBottom: '1px solid #d9d9d9',
            paddingBottom: '10px',
            fontSize: '20px'
          }}>
            KINH NGHIỆM LÀM VIỆC
          </Title>
          {workHistory.slice(0, 4).map(work => (
            <div key={work.id} style={{ marginBottom: '20px' }}>
              <Title level={4} style={{ 
                margin: '0 0 5px',
                fontFamily: 'Times New Roman',
                fontSize: '16px'
              }}>
                {work.position}
              </Title>
              <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                {work.companyName}
              </Text>
              <Text type="secondary" style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                {new Date(work.startDate).toLocaleDateString('vi-VN')} - 
                {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
              </Text>
              <div 
                className="ql-editor"
                dangerouslySetInnerHTML={sanitizeHTML(work.description)}
                style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.4',
                  maxHeight: '60px',
                  overflow: 'hidden'
                }}
              />
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={{ marginBottom: '30px' }}>
          <Title level={3} style={{ 
            fontFamily: 'Times New Roman',
            borderBottom: '1px solid #d9d9d9',
            paddingBottom: '10px',
            fontSize: '20px'
          }}>
            KỸ NĂNG
          </Title>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px',
            marginTop: '15px'
          }}>
            {skills.slice(0, 8).map(skill => (
              <div 
                key={skill.id} 
                style={{ 
                  padding: '6px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  color: PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color,
                  fontSize: '14px',
                  fontFamily: 'Times New Roman'
                }}
              >
                {skill.skillName} - {PROFICIENCY_LEVELS[skill.proficiencyLevel]?.label}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <Title level={3} style={{ 
            fontFamily: 'Times New Roman',
            borderBottom: '1px solid #d9d9d9',
            paddingBottom: '10px',
            fontSize: '20px'
          }}>
            HỌC VẤN
          </Title>
          <Title level={4} style={{ 
            margin: '15px 0 10px',
            fontFamily: 'Times New Roman',
            fontSize: '16px'
          }}>
            {candidateData?.educationLevel}
          </Title>
          <div 
            className="ql-editor"
            dangerouslySetInnerHTML={sanitizeHTML(candidateData?.educationDescription)}
            style={{ 
              fontSize: '14px', 
              lineHeight: '1.4',
              maxHeight: '80px',
              overflow: 'hidden'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate; 