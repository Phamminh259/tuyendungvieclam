import React from 'react';
import { Typography, Row, Col, Tag, Divider } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, GlobalOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text } = Typography;

const PROFICIENCY_LEVELS = {
  BEGINNER: { label: 'Cơ bản', color: '#d9d9d9' },
  INTERMEDIATE: { label: 'Trung bình', color: '#bfbfbf' },
  ADVANCED: { label: 'Nâng cao', color: '#8c8c8c' },
  EXPERT: { label: 'Chuyên gia', color: '#595959' }
};

const sanitizeHTML = (html) => {
  return { __html: DOMPurify.sanitize(html || '') };
};

const MinimalistTemplate = ({ candidateData, skills, workHistory }) => {
  return (
    <div style={{ 
      padding: '60px',
      backgroundColor: '#fff',
      width: '794px',
      height: '1123px',
      margin: '0 auto',
      fontFamily: 'Helvetica, Arial, sans-serif',
      letterSpacing: '0.5px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Row gutter={[60, 0]} style={{ flex: 1, height: '100%' }}>
        {/* Left Column */}
        <Col span={8}>
          <div style={{ position: 'sticky', top: '60px' }}>
            {/* Avatar - Fixed size */}
            <div style={{ 
              width: '180px',
              height: '180px',
              borderRadius: '4px', // Thay đổi từ hình tròn sang hình vuông bo góc
              overflow: 'hidden',
              margin: '0 auto 30px',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)' // Thêm bóng nhẹ
            }}>
              <img 
                src={candidateData?.avatar || 'https://via.placeholder.com/180'} 
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Contact Info - Fixed height */}
            <div style={{ marginBottom: '40px', height: '140px' }}>
              <Title level={4} style={{ 
                marginBottom: '20px', 
                color: '#262626',
                fontSize: '14px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                LIÊN HỆ
              </Title>
              {candidateData?.phone && (
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                  <PhoneOutlined style={{ marginRight: '10px', color: '#595959', fontSize: '14px' }} />
                  <Text style={{ fontSize: '13px' }}>{candidateData.phone}</Text>
                </div>
              )}
              {candidateData?.email && (
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                  <MailOutlined style={{ marginRight: '10px', color: '#595959', fontSize: '14px' }} />
                  <Text style={{ fontSize: '13px' }}>{candidateData.email}</Text>
                </div>
              )}
              {candidateData?.address && (
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                  <HomeOutlined style={{ marginRight: '10px', color: '#595959', fontSize: '14px' }} />
                  <Text style={{ fontSize: '13px' }}>{candidateData.address}</Text>
                </div>
              )}
            </div>

            {/* Skills - Scrollable */}
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <Title level={4} style={{ 
                marginBottom: '20px', 
                color: '#262626',
                fontSize: '14px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                KỸ NĂNG
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {skills.slice(0, 8).map(skill => (
                  <div key={skill.id}>
                    <Text strong style={{ 
                      color: '#595959', 
                      fontSize: '13px',
                      display: 'block',
                      marginBottom: '5px'
                    }}>
                      {skill.skillName}
                    </Text>
                    <div style={{ 
                      height: '2px', // Giảm độ dày của thanh progress
                      backgroundColor: '#f5f5f5',
                      borderRadius: '1px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${PROFICIENCY_LEVELS[skill.proficiencyLevel]?.percent || 0}%`,
                        backgroundColor: PROFICIENCY_LEVELS[skill.proficiencyLevel]?.color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column */}
        <Col span={16}>
          {/* Header - Fixed height */}
          <div style={{ marginBottom: '40px', height: '100px' }}>
            <Title style={{ 
              fontSize: '32px',
              marginBottom: '8px',
              color: '#262626',
              fontWeight: '300',
              letterSpacing: '1px'
            }}>
              {candidateData?.fullName}
            </Title>
            <Title level={3} style={{ 
              margin: '0',
              color: '#595959',
              fontWeight: '300',
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}>
              {candidateData?.title || 'Chức danh'}
            </Title>
          </div>

          {/* About - Fixed height */}
          <div style={{ marginBottom: '40px', height: '160px' }}>
            <Title level={4} style={{ 
              marginBottom: '20px', 
              color: '#262626',
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              GIỚI THIỆU
            </Title>
            <div 
              className="ql-editor"
              dangerouslySetInnerHTML={sanitizeHTML(candidateData?.description)}
              style={{ 
                fontSize: '13px', 
                lineHeight: '1.8', 
                color: '#595959',
                maxHeight: '120px',
                overflow: 'hidden'
              }}
            />
          </div>

          {/* Experience - Scrollable */}
          <div style={{ marginBottom: '40px', maxHeight: '400px', overflow: 'auto' }}>
            <Title level={4} style={{ 
              marginBottom: '20px', 
              color: '#262626',
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              KINH NGHIỆM LÀM VIỆC
            </Title>
            {workHistory.slice(0, 4).map((work, index) => (
              <div key={work.id} style={{ marginBottom: index !== workHistory.length - 1 ? '25px' : 0 }}>
                <Title level={5} style={{ 
                  margin: '0 0 5px', 
                  color: '#262626',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {work.position}
                </Title>
                <Text strong style={{ 
                  color: '#595959', 
                  display: 'block', 
                  marginBottom: '5px',
                  fontSize: '13px'
                }}>
                  {work.companyName}
                </Text>
                <Text type="secondary" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '12px'
                }}>
                  {new Date(work.startDate).toLocaleDateString('vi-VN')} - 
                  {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                </Text>
                <div 
                  className="ql-editor"
                  dangerouslySetInnerHTML={sanitizeHTML(work.description)}
                  style={{ 
                    fontSize: '13px', 
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
              marginBottom: '20px', 
              color: '#262626',
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              HỌC VẤN
            </Title>
            <Title level={5} style={{ 
              margin: '0 0 10px', 
              color: '#262626',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {candidateData?.educationLevel}
            </Title>
            <div 
              className="ql-editor"
              dangerouslySetInnerHTML={sanitizeHTML(candidateData?.educationDescription)}
              style={{ 
                fontSize: '13px', 
                lineHeight: '1.6', 
                color: '#595959',
                maxHeight: '100px',
                overflow: 'hidden'
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MinimalistTemplate; 