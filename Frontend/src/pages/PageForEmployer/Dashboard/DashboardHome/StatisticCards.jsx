import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  UserOutlined, 
  EyeOutlined, 
  CheckCircleOutlined, 
  FileOutlined 
} from '@ant-design/icons';
import { getJobsByEmployerId } from '../../../../api/jobApi';
import { getAcceptedApplicationsByEmployer } from '../../../../api/applicationApi';
import { AuthContext } from '../../../../components/auth/AuthProvider';

const StatisticCards = () => {
  const [activeJobs, setActiveJobs] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [newCandidates, setNewCandidates] = useState(0);
  const [approvedCVs, setApprovedCVs] = useState(0);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Lấy danh sách jobs
        const jobsData = await getJobsByEmployerId(user.id);
        const approvedActiveJobs = jobsData.filter(job => job.approved && job.isActive);
        setActiveJobs(approvedActiveJobs.length);
        
        // Tính tổng lượt xem
        const totalJobViews = jobsData.reduce((sum, job) => sum + (job.viewCount || 0), 0);
        setTotalViews(totalJobViews);
        
        // Lấy danh sách ứng viên đã được chấp nhận
        const candidatesData = await getAcceptedApplicationsByEmployer(user.id);
        setNewCandidates(candidatesData.length);
        
        // Đếm số CV đã duyệt (status là ACCEPTED)
        const approvedApplications = candidatesData.filter(candidate => 
          candidate.applications.some(app => app.status === 'Accepted')
        ).length;
        setApprovedCVs(approvedApplications);
        
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Tin tuyển dụng đang đăng"
            value={activeJobs}
            prefix={<FileOutlined />}
            loading={loading}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Lượt xem tin"
            value={totalViews}
            prefix={<EyeOutlined />}
            loading={loading}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Ứng viên mới"
            value={newCandidates}
            prefix={<UserOutlined />}
            loading={loading}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="CV đã duyệt"
            value={approvedCVs}
            prefix={<CheckCircleOutlined />}
            loading={loading}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCards; 