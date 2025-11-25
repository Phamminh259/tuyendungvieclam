import React, { useState, useEffect } from 'react';
import { Card, Tabs, message, Button, Alert } from 'antd';
import { getJobsByEmployerId } from '../../../../api/jobApi';
import { getEmployerByEmail } from "../../../../api/employerApi";
import JobTable from './components/JobTable';
import CreateJob from './components/CreateJob';

const { TabPane } = Tabs;

const JobPostManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Fetch jobs data
  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      const employerUser = localStorage.getItem("employer_user");
      if (!employerUser) {
        message.error("Vui lòng đăng nhập lại");
        return;
      }

      const userData = JSON.parse(employerUser);
      const employerData = await getEmployerByEmail(userData.email);
      
      if (!employerData?.id) {
        message.error("Không tìm thấy thông tin nhà tuyển dụng");
        return;
      }

      const response = await getJobsByEmployerId(employerData.id);
      setJobs(response);
    } catch (error) {
      message.error('Lỗi khi tải danh sách tin tuyển dụng');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on tab
  const getAllJobsList = () => jobs;
  const getPendingJobs = () => jobs.filter(job => !job.approved);
  const getApprovedJobs = () => jobs.filter(job => job.approved && job.isActive);
  const getViolationJobs = () => jobs.filter(job => !job.isActive);
  const getBlockedJobs = () => jobs.filter(job => !job.isActive && !job.approved);

  return (
    <Card 
      title="Quản lý tin tuyển dụng"
      extra={
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          Tạo tin mới
        </Button>
      }
    >
      <Tabs defaultActiveKey="all">
        <TabPane tab="Tất cả tin" key="all">
          <JobTable 
            jobs={getAllJobsList()}
            loading={loading}
            onJobUpdated={fetchJobs}
          />
        </TabPane>

        <TabPane tab="Đã duyệt" key="approved">
          <Alert
            message="Tin tuyển dụng đã duyệt"
            description="Các tin tuyển dụng đã được phê duyệt và đang được hiển thị công khai."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <JobTable 
            jobs={getApprovedJobs()}
            loading={loading}
            onJobUpdated={fetchJobs}
          />
        </TabPane>

        <TabPane tab="Chờ duyệt" key="pending">
          <Alert
            message="Tin tuyển dụng chờ duyệt"
            description="Các tin tuyển dụng đang chờ admin phê duyệt. Vui lòng đợi trong thời gian sớm nhất."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <JobTable 
            jobs={getPendingJobs()}
            loading={loading}
            onJobUpdated={fetchJobs}
          />
        </TabPane>

        <TabPane tab="Vi phạm" key="violation">
          <Alert
            message="Tin tuyển dụng vi phạm"
            description="Các tin tuyển dụng vi phạm quy định sẽ tạm dừng hiển thị. Vui lòng chỉnh sửa nội dung để đáp ứng quy định."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <JobTable 
            jobs={getViolationJobs()}
            loading={loading}
            onJobUpdated={fetchJobs}
          />
        </TabPane>

        <TabPane tab="Đã khóa" key="blocked">
          <Alert
            message="Tin tuyển dụng bị khóa"
            description="Các tin tuyển dụng bị khóa do vi phạm nghiêm trọng hoặc nhiều lần. Vui lòng liên hệ admin để được hỗ trợ."
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <JobTable 
            jobs={getBlockedJobs()}
            loading={loading}
            onJobUpdated={fetchJobs}
          />
        </TabPane>
      </Tabs>

      <CreateJob
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          setIsCreateModalVisible(false);
          fetchJobs();
        }}
      />
    </Card>
  );
};

export default JobPostManagement; 