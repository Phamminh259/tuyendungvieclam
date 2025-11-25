import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Descriptions, Timeline, Button, Tag, Row, Col, Card, Avatar, Typography, Divider, Space, message, Spin } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  BookOutlined,
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { getInterviewsByApplication, getInterviewsByCandidate } from '../../../../../api/interviewApi';
import { getAllWorkHistories } from '../../../../../api/candidateApi';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const CandidateDetail = ({ data, onClose }) => {
  const [interviews, setInterviews] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingInterviews, setLoadingInterviews] = useState(false);

  useEffect(() => {
    if (data?.id) {
      fetchInterviews();
      fetchWorkHistory();
    }
  }, [data]);

  const fetchInterviews = async () => {
    try {
      setLoadingInterviews(true);
      // Thử lấy theo application trước
      const applicationId = data.applications?.[0]?.id;
      if (applicationId) {
        const response = await getInterviewsByApplication(applicationId);
        if (response && response.length > 0) {
          setInterviews(response);
          return;
        }
      }

      // Nếu không có kết quả, thử lấy theo candidate
      const candidateResponse = await getInterviewsByCandidate(data.id);
      setInterviews(candidateResponse || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      message.error('Lỗi khi tải lịch phỏng vấn');
    } finally {
      setLoadingInterviews(false);
    }
  };

  const fetchWorkHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await getAllWorkHistories(data.id);
      setWorkHistory(response);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử làm việc:', error);
      message.error('Không thể tải lịch sử làm việc');
    } finally {
      setLoadingHistory(false);
    }
  };

  const renderInterviewStatus = (status) => {
    const statusConfig = {
      'SCHEDULED': { color: 'blue', text: 'Đã lên lịch' },
      'COMPLETED': { color: 'green', text: 'Đã hoàn thành' },
      'CANCELLED': { color: 'red', text: 'Đã hủy' }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  if (!data) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'blue';
      case 'Accepted': return 'green';
      case 'Rejected': return 'red';
      default: return 'default';
    }
  };

  const renderEducationLevel = (level) => {
    const levels = {
      HIGH_SCHOOL: 'Trung học phổ thông',
      COLLEGE: 'Cao đẳng',
      UNIVERSITY: 'Đại học',
      POSTGRADUATE: 'Sau đại học',
      DOCTORATE: 'Tiến sĩ',
      OTHER: 'Khác'
    };
    return levels[level] || level;
  };

  const renderExperienceLevel = (level) => {
    const levels = {
      NO_EXPERIENCE: 'Chưa có kinh nghiệm',
      LESS_THAN_1_YEAR: 'Dưới 1 năm',
      ONE_TO_THREE_YEARS: '1-3 năm',
      THREE_TO_FIVE_YEARS: '3-5 năm',
      FIVE_TO_TEN_YEARS: '5-10 năm',
      MORE_THAN_TEN_YEARS: 'Trên 10 năm'
    };
    return levels[level] || level;
  };

  return (
    <Modal
      title={
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={64} icon={<UserOutlined />} src={data.avatar} />
          </Col>
          <Col>
            <Title level={4} style={{ margin: 0 }}>{data.fullName}</Title>
            <Text type="secondary">{data.title || 'Chưa cập nhật vị trí'}</Text>
          </Col>
        </Row>
      }
      open={true}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thông tin cá nhân" key="1">
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Card title="Thông tin liên hệ" bordered={false}>
                <Descriptions column={1}>
                  <Descriptions.Item label={<><MailOutlined /> Email</>}>
                    {data.email}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                    {data.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                    {data.address}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><CalendarOutlined /> Ngày sinh</>}>
                    {new Date(data.birthday).toLocaleDateString('vi-VN')}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="Học vấn & Kinh nghiệm" bordered={false} style={{ marginTop: 16 }}>
                <Descriptions column={1}>
                  <Descriptions.Item label={<><BookOutlined /> Trình độ học vấn</>}>
                    {renderEducationLevel(data.educationLevel)}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><ClockCircleOutlined /> Kinh nghiệm</>}>
                    {renderExperienceLevel(data.experienceLevel)}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><DollarOutlined /> Mức lương mong muốn</>}>
                    {data.expectedSalary?.toLocaleString('vi-VN')} VNĐ
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Kỹ năng" bordered={false}>
                {data.candidateSkills?.map(skill => (
                  <Tag key={skill.id} color="blue" style={{ margin: '0 8px 8px 0' }}>
                    {skill.skillName} - {skill.proficiencyLevel}
                  </Tag>
                ))}
              </Card>

              <Card title="Chứng chỉ" bordered={false} style={{ marginTop: 16 }}>
                {data.certifications?.map((cert, index) => (
                  <Tag key={index} color="green" icon={<TrophyOutlined />} style={{ margin: '0 8px 8px 0' }}>
                    {cert}
                  </Tag>
                ))}
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Kinh nghiệm làm việc" key="2">
          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : workHistory && workHistory.length > 0 ? (
            <Timeline mode="left">
              {workHistory.map((work, index) => (
                <Timeline.Item key={index} dot={<TeamOutlined />}>
                  <Card bordered={false}>
                    <Title level={5}>{work.companyName}</Title>
                    <Text type="secondary">
                      {new Date(work.startDate).toLocaleDateString('vi-VN')} - 
                      {work.endDate ? new Date(work.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                    </Text>
                    <br />
                    <Text strong>{work.position}</Text>
                    <p>{work.description}</p>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <TeamOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
                <Title level={4} style={{ color: '#595959', marginBottom: 8 }}>
                  Chưa có kinh nghiệm làm việc
                </Title>
                <Text type="secondary">
                  {data.experienceLevel === 'NO_EXPERIENCE' 
                    ? 'Ứng viên này chưa có kinh nghiệm làm việc trước đây.'
                    : 'Ứng viên chưa cập nhật thông tin kinh nghiệm làm việc.'}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 13, marginTop: 8 }}>
                  Bạn có thể đánh giá ứng viên dựa trên các yếu tố khác như:
                </Text>
                <Row justify="center" style={{ marginTop: 16 }}>
                  <Col>
                    <Space size={[16, 16]} wrap>
                      <Tag icon={<BookOutlined />} color="blue">
                        Trình độ học vấn
                      </Tag>
                      <Tag icon={<TrophyOutlined />} color="gold">
                        Chứng chỉ
                      </Tag>
                      <Tag icon={<FileTextOutlined />} color="cyan">
                        CV đính kèm
                      </Tag>
                      <Tag icon={<CheckCircleOutlined />} color="green">
                        Kỹ năng
                      </Tag>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Card>
          )}
        </TabPane>

        <TabPane tab="Lịch phỏng vấn" key="3">
          {loadingInterviews ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : interviews.length > 0 ? (
            <Timeline>
              {interviews.map(interview => (
                <Timeline.Item 
                  key={interview.id}
                  color={interview.status === 'COMPLETED' ? 'green' : 'blue'}
                  dot={interview.status === 'COMPLETED' ? <CheckCircleOutlined /> : <CalendarOutlined />}
                >
                  <Card bordered={false}>
                    <Title level={5}>{interview.title}</Title>
                    <Space direction="vertical">
                      <Text>
                        <CalendarOutlined /> Thời gian: {interview.interviewDate} {interview.interviewTime}
                      </Text>
                      <Text>
                        <EnvironmentOutlined /> Địa điểm: {interview.location}
                      </Text>
                      <Text>
                        Hình thức: <Tag color={interview.type === 'ONLINE' ? 'blue' : 'orange'}>
                          {interview.type === 'ONLINE' ? 'Trực tuyến' : 'Trực tiếp'}
                        </Tag>
                      </Text>
                      <Text>
                        Trạng thái: {renderInterviewStatus(interview.status)}
                      </Text>
                      {interview.note && (
                        <>
                          <Divider style={{ margin: '8px 0' }} />
                          <Text>Ghi chú: {interview.note}</Text>
                        </>
                      )}
                    </Space>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CalendarOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
                <Title level={4} style={{ color: '#595959', marginBottom: 8 }}>
                  Chưa có lịch phỏng vấn
                </Title>
                <Text type="secondary">
                  Ứng viên này chưa có lịch phỏng vấn nào được sắp xếp.
                </Text>
              </div>
            </Card>
          )}
        </TabPane>

        {data.attachedFile && (
          <TabPane tab="Tài liệu đính kèm" key="4">
            <Button 
              type="primary" 
              icon={<FileTextOutlined />}
              onClick={() => window.open(data.attachedFile)}
            >
              Xem CV đính kèm
            </Button>
          </TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default CandidateDetail; 