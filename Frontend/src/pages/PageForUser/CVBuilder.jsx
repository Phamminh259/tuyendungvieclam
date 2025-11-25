import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Layout, Typography, Row, Col, Card, Button, message, Modal, Spin } from 'antd';
import ModernTemplate from '../../components/user/cv/ModernTemplate';
import ClassicTemplate from '../../components/user/cv/ClassicTemplate';
import CreativeTemplate from '../../components/user/cv/CreativeTemplate';
import MinimalistTemplate from "../../components/user/cv/MinimalistTemplate";
import ProfessionalTemplate from "../../components/user/cv/ProfessionalTemplate";
import ExecutiveTemplate from "../../components/user/cv/ExecutiveTemplate";
import ElegantTemplate from '../../components/user/cv/ElegantTemplate';
import DynamicTemplate from '../../components/user/cv/DynamicTemplate';
import MinimalModernTemplate from '../../components/user/cv/MinimalModernTemplate';
import { getCandidateProfileByEmail } from '../../api/candidateApi';
import { getCandidateSkills } from '../../api/candidateSkillApi';
import { getAllWorkHistories } from '../../api/candidateApi';
import { AuthContext } from '../../components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { uploadCV, updateCandidateCV } from '../../api/cvApi';
import CV1 from '../../assets/image/CV/CV1.png';
import CV2 from '../../assets/image/CV/CV2.png';
import CV3 from '../../assets/image/CV/CV3.png';
import CV4 from '../../assets/image/CV/CV4.png';
import CV5 from '../../assets/image/CV/CV5.png';
import CV6 from '../../assets/image/CV/CV6.png';
import CV7 from '../../assets/image/CV/CV7.png';
import CV8 from '../../assets/image/CV/CV8.png';
import CV9 from '../../assets/image/CV/CV9.png';
import { LeftOutlined, SaveOutlined } from '@ant-design/icons';


const { Content } = Layout;
const { Title } = Typography;

const CV_WIDTH = 794;  // Tương đương khổ A4 width
const CV_HEIGHT = 1123; // Tương đương khổ A4 height

const TemplateCard = ({ template, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      hoverable
      className="template-card"
      style={{
        height: '100%',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
      cover={
        <div style={{ 
          height: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          position: 'relative'
        }}>
          {!imageLoaded && <Spin size="large" />}
          <img 
            alt={template.name} 
            src={template.preview}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '10px',
              transition: 'transform 0.3s ease',
              display: imageLoaded ? 'block' : 'none'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error(`Failed to load image for ${template.name}`);
              e.target.src = 'https://via.placeholder.com/400?text=Template+Preview';
              setImageLoaded(true);
            }}
          />
        </div>
      }
      actions={[
        <Button 
          type="primary"
          size="large"
          onClick={() => onSelect(template)}
          className="template-button"
          style={{
            background: 'linear-gradient(to right, #020024, #cc0a9d)',
            border: 'none',
            borderRadius: '25px',
            margin: '10px 20px',
            height: '40px',
            fontSize: '16px'
          }}
        >
          Tạo với thiết kế này
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            {template.name}
          </Typography.Title>
        }
        description={
          <Typography.Text style={{ fontSize: '16px' }}>
            {template.description}
          </Typography.Text>
        }
      />
    </Card>
  );
};

// Trang các mẫu CV
const CVBuilder = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCV, setSavingCV] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
      return;
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);

    const fetchCandidateData = async () => {
      try {
        if (!user?.email) {
          throw new Error('Không tìm thấy email người dùng');
        }

        const profileData = await getCandidateProfileByEmail(user.email);
        
        if (!profileData) {
          message.error('Không tìm thấy thông tin ứng viên');
          return;
        }

        const [skillsData, workHistoryData] = await Promise.all([
          getCandidateSkills(profileData.id),
          getAllWorkHistories(profileData.id)
        ]);

        setCandidateData(profileData);
        setSkills(skillsData || []);
        setWorkHistory(workHistoryData || []);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin ứng viên:', error);
        message.error('Không thể tải thông tin ứng viên');
      }
    };

    fetchCandidateData();
  }, [isAuthenticated, user, navigate]);

  const handleSelectTemplate = useCallback(async (template) => {
    try {
      setLoading(true);
      
      if (!candidateData?.id) {
        message.error('Không tìm thấy thông tin ứng viên');
        return;
      }

      const [skillsData, workHistoryData] = await Promise.all([
        getCandidateSkills(candidateData.id),
        getAllWorkHistories(candidateData.id)
      ]);

      setSkills(skillsData || []);
      setWorkHistory(workHistoryData || []);
      setSelectedTemplate(template);
      message.success(`Đã chọn mẫu ${template.name}`);
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi khi tải thông tin. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  }, [candidateData]);

  const handleSaveCV = async () => {
    try {
      setSavingCV(true);
      
      const cvElement = document.getElementById('cv-template');
      
      // Tạo một bản sao của CV
      const clone = cvElement.cloneNode(true);
      
      // Xử lý tất cả các phần tử có màu OKLCH
      const convertStyles = (element) => {
        const elements = element.getElementsByTagName('*');
        Array.from(elements).forEach(el => {
          // Chuyển đổi tất cả màu nền và gradient thành màu cơ bản
          el.style.setProperty('background', '#ffffff', 'important');
          el.style.setProperty('background-image', 'none', 'important');
          
          // Chuyển đổi màu chữ thành màu đen
          if (window.getComputedStyle(el).color.includes('oklch')) {
            el.style.setProperty('color', '#000000', 'important');
          }
          
          // Xử lý các component Progress của Ant Design
          if (el.classList.contains('ant-progress')) {
            el.style.setProperty('--antd-wave-shadow-color', '#1890ff', 'important');
          }
        });
      };

      convertStyles(clone);
      
      // Thiết lập kích thước và vị trí
      clone.style.width = `${CV_WIDTH}px`;
      clone.style.height = `${CV_HEIGHT}px`;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        foreignObjectRendering: false
      });
      
      // Dọn dẹp
      document.body.removeChild(clone);
      
      // Tiếp tục xử lý và lưu CV
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      const token = localStorage.getItem('user_token');
      const cvUrl = await uploadCV(blob, token);
      const updatedProfile = await updateCandidateCV(candidateData.id, cvUrl);
      
      setCandidateData(updatedProfile);
      message.success('Lưu CV thành công');
      setIsModalVisible(false);
      
    } catch (error) {
      console.error('Lỗi khi lưu CV:', error);
      message.error('Lỗi khi lưu CV: ' + error.message);
    } finally {
      setSavingCV(false);
    }
  };

  const templates = [
    {
      id: 1,
      name: "Modern Template",
      preview: CV1,
      component: ModernTemplate,
      description: "Mẫu CV hiện đại, chuyên nghiệp"
    },
    {
      id: 2, 
      name: "Classic Template",
      preview: CV2,
      component: ClassicTemplate,
      description: "Mẫu CV cổ điển, trang nhã"
    },
    {
      id: 3,
      name: "Creative Template", 
      preview: CV3,
      component: CreativeTemplate,
      description: "Mẫu CV sáng tạo, nổi bật"
    },
    {
      id: 4,
      name: "Minimalist Template",
      preview: CV4,
      component: MinimalistTemplate,
      description: "Mẫu CV tối giản, chuyên nghiệp"
    },
    {
      id: 5,
      name: "Professional Template",
      preview: CV5,
      component: ProfessionalTemplate, 
      description: "Mẫu CV hiện đại, sang trọng"
    },
    {
      id: 6,
      name: "Executive Template",
      preview: CV6,
      component: ExecutiveTemplate,
      description: "Mẫu CV cao cấp, độc đáo"
    },
    {
      id: 7,
      name: "Elegant Template",
      preview: CV7,
      component: ElegantTemplate,
      description: "Mẫu CV thanh lịch, sang trọng"
    },
    {
      id: 8,
      name: "Dynamic Template",
      preview: CV8,
      component: DynamicTemplate,
      description: "Mẫu CV năng động, hiện đại"
    },
    {
      id: 9,
      name: "Minimal Modern Template",
      preview: CV9,
      component: MinimalModernTemplate,
      description: "Mẫu CV tối giản, tinh tế"
    }
  ];

  if(loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" tip="Đang tải thông tin công ty..." />
      </div>
    );
  }
  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    }}>
      <Content style={{ 
        padding: '50px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 50,
          padding: '20px'
        }}>
          <Title level={2} style={{
            background: 'linear-gradient(45deg, #020024, #cc0a9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 15
          }}>
            Tạo CV Chuyên Nghiệp
          </Title>
          <Typography.Paragraph style={{
            fontSize: '18px',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Chọn một trong những mẫu CV được thiết kế chuyên nghiệp dưới đây để bắt đầu hành trình sự nghiệp của bạn
          </Typography.Paragraph>
        </div>

        {!selectedTemplate ? (
          <Row gutter={[24, 24]}>
            {templates.map(template => (
              <Col key={template.id} xs={24} sm={12} md={8}>
                <TemplateCard 
                  template={template} 
                  onSelect={handleSelectTemplate}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <Button 
                onClick={() => setSelectedTemplate(null)}
                icon={<LeftOutlined />}
                size="large"
                style={{
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Quay lại
              </Button>
              <Button 
                type="primary"
                size="large"
                onClick={() => setIsModalVisible(true)}
                style={{
                  background: 'linear-gradient(to right, #020024, #cc0a9d)',
                  border: 'none',
                  borderRadius: '8px'
                }}
                icon={<SaveOutlined />}
              >
                Lưu CV
              </Button>
            </div>
            
            {/* CV Template Container */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
              background: '#f5f5f5',
              borderRadius: '10px'
            }}>
              <div id="cv-template" style={{
                width: `${CV_WIDTH}px`,
                height: `${CV_HEIGHT}px`,
                backgroundColor: 'white',
                boxShadow: '0 0 30px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {React.createElement(selectedTemplate.component, {
                  candidateData,
                  skills,
                  workHistory,
                  onBack: () => setSelectedTemplate(null)
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal styling */}
        <Modal
          title={
            <div style={{ textAlign: 'center', color: '#020024' }}>
              Xác nhận lưu CV
            </div>
          }
          open={isModalVisible}
          onOk={handleSaveCV}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={savingCV}
          okText="Lưu CV"
          cancelText="Hủy"
          okButtonProps={{
            style: {
              background: 'linear-gradient(to right, #020024, #cc0a9d)',
              border: 'none'
            }
          }}
          centered
        >
          <p style={{ textAlign: 'center', fontSize: '16px' }}>
            Bạn có chắc muốn lưu CV này không?
          </p>
        </Modal>

        {/* Add global styles */}
        <style jsx global>{`
          .template-card {
            transition: transform 0.3s ease;
          }
          .template-card:hover {
            transform: translateY(-5px);
          }
          .template-button {
            transition: all 0.3s ease;
          }
          .template-button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .content-fade-in {
            animation: fadeIn 0.5s ease-in;
          }
        `}</style>
      </Content>
    </Layout>
  );
};

export default CVBuilder;