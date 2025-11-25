import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Tag, Space, message, Spin } from 'antd';
import { getJobById, approveJob, rejectJob } from '../../../../api/jobApi';

const JobDetail = ({ id }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await getJobById(id);
      setJob(data);
    } catch (error) {
      message.error('Lỗi khi tải thông tin tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = () => {
    if (!job.isActive) {
      message.warning('Không thể thay đổi trạng thái tin đã hết hạn');
      return;
    }

    if (job.approved) {
      rejectJob(id)
        .then(() => {
          message.success('Hủy duyệt tin tuyển dụng thành công');
          fetchJobDetails();
        })
        .catch(() => message.error('Lỗi khi hủy duyệt tin tuyển dụng'));
    } else {
      approveJob(id)
        .then(() => {
          message.success('Duyệt tin tuyển dụng thành công');
          fetchJobDetails();
        })
        .catch(() => message.error('Lỗi khi duyệt tin tuyển dụng'));
    }
  };

  const getStatusTag = () => {
    if (!job.isActive) {
      return <Tag color="gray">Hết hạn</Tag>;
    }
    return (
      <Tag color={job.approved ? 'green' : 'red'}>
        {job.approved ? 'Đang hiển thị' : 'Chưa duyệt'}
      </Tag>
    );
  };

  const getEducationLevel = (level) => {
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

  const getExperienceLevel = (level) => {
    const levels = {
      NO_EXPERIENCE: 'Không yêu cầu kinh nghiệm',
      LESS_THAN_1_YEAR: 'Dưới 1 năm',
      ONE_TO_THREE_YEARS: '1-3 năm',
      THREE_TO_FIVE_YEARS: '3-5 năm',
      FIVE_TO_TEN_YEARS: '5-10 năm',
      MORE_THAN_TEN_YEARS: 'Trên 10 năm'
    };
    return levels[level] || level;
  };

  const getJobLevel = (level) => {
    const levels = {
      INTERN: 'Thực tập sinh',
      FRESHER: 'Mới tốt nghiệp',
      JUNIOR: 'Junior',
      MIDDLE: 'Middle',
      SENIOR: 'Senior',
      LEAD: 'Lead',
      MANAGER: 'Manager'
    };
    return levels[level] || level;
  };

  const getJobType = (type) => {
    const types = {
      FULL_TIME: 'Toàn thời gian',
      PART_TIME: 'Bán thời gian',
      SEASONAL: 'Thời vụ'
    };
    return types[type] || type;
  };

  const getProficiencyLevel = (level) => {
    const levels = {
      BEGINNER: 'Cơ bản',
      INTERMEDIATE: 'Trung bình',
      ADVANCED: 'Nâng cao',
      EXPERT: 'Chuyên sâu'
    };
    return levels[level] || level;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Không tìm thấy thông tin tin tuyển dụng
      </div>
    );
  }

  return (
    <Card 
      title="Chi tiết tin tuyển dụng"
      extra={
        job.isActive && (
          <Button 
            type={job.approved ? 'default' : 'primary'}
            danger={job.approved}
            onClick={handleStatusChange}
          >
            {job.approved ? 'Hủy duyệt' : 'Duyệt'}
          </Button>
        )
      }
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Mã tin" span={1}>
          {job.code}
        </Descriptions.Item>

        <Descriptions.Item label="Lượt xem" span={1}>
          {job.viewCount}
        </Descriptions.Item>

        <Descriptions.Item label="Tiêu đề" span={2}>
          {job.title}
        </Descriptions.Item>

        <Descriptions.Item label="Công ty" span={2}>
          <Space>
            <img 
              src={job.companyLogo} 
              alt={job.companyName} 
              style={{ width: 40, height: 40, objectFit: 'contain' }}
            />
            {job.companyName}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Người đăng" span={2}>
          {job.employerName}
        </Descriptions.Item>

        <Descriptions.Item label="Ngành nghề" span={1}>
          {job.professionName}
        </Descriptions.Item>

        <Descriptions.Item label="Lĩnh vực" span={1}>
          {job.industryName}
        </Descriptions.Item>

        <Descriptions.Item label="Địa điểm" span={2}>
          {job.location}
        </Descriptions.Item>

        <Descriptions.Item label="Mức lương" span={1}>
          {job.salary?.toLocaleString('vi-VN')} VNĐ
        </Descriptions.Item>

        <Descriptions.Item label="Số lượt ứng tuyển" span={1}>
          {job.applicationCount}
        </Descriptions.Item>

        <Descriptions.Item label="Cấp bậc" span={1}>
          {getJobLevel(job.requiredJobLevel)}
        </Descriptions.Item>

        <Descriptions.Item label="Kinh nghiệm" span={1}>
          {getExperienceLevel(job.requiredExperienceLevel)}
        </Descriptions.Item>

        <Descriptions.Item label="Bằng cấp" span={1}>
          {getEducationLevel(job.requiredEducationLevel)}
        </Descriptions.Item>

        <Descriptions.Item label="Hình thức" span={1}>
          {getJobType(job.requiredJobType)}
        </Descriptions.Item>

        <Descriptions.Item label="Kỹ năng yêu cầu" span={2}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {job.skills?.map(skill => (
              <Card 
                key={skill.id} 
                size="small" 
                style={{ marginBottom: 8 }}
              >
                <Space wrap align="start">
                  <Tag color={skill.isRequired ? 'blue' : 'green'}>
                    {skill.skillName}
                  </Tag>
                  {skill.proficiencyLevel && (
                    <Tag color="orange">
                      {getProficiencyLevel(skill.proficiencyLevel)}
                    </Tag>
                  )}
                  {skill.isRequired && (
                    <Tag color="red">Bắt buộc</Tag>
                  )}
                </Space>
                {skill.description && (
                  <div style={{ marginTop: 8 }}>
                    {skill.description}
                  </div>
                )}
              </Card>
            ))}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Mô tả công việc" span={2}>
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        </Descriptions.Item>

        <Descriptions.Item label="Ngày đăng">
          {new Date(job.createdDate).toLocaleDateString('vi-VN')}
        </Descriptions.Item>

        <Descriptions.Item label="Hạn nộp">
          <Space>
            {new Date(job.expiryDate).toLocaleDateString('vi-VN')}
            {!job.isActive && <Tag color="red">Đã hết hạn</Tag>}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái" span={2}>
          {getStatusTag()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default JobDetail; 