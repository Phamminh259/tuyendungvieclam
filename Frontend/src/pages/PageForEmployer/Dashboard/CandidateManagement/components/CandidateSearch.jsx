import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Select, Space, Row, Col } from 'antd';
import axios from 'axios';
import { getJobsByEmployerId } from '../../../../../api/jobApi';
import { getAllCandidates } from '../../../../../api/candidateApi';
import { getEmployerByEmail } from '../../../../../api/employerApi';
import { getCurrentPackage } from '../../../../../api/subscriptionApi';

const { Option } = Select;

// Mapping cho experienceLevel
const experienceLevelMap = {
  NO_EXPERIENCE: 'Chưa có kinh nghiệm',
  LESS_THAN_1_YEAR: 'Dưới 1 năm',
  ONE_TO_THREE_YEARS: '1-3 năm',
  THREE_TO_FIVE_YEARS: '3-5 năm',
  FIVE_TO_TEN_YEARS: '5-10 năm',
  MORE_THAN_TEN_YEARS: 'Trên 10 năm'
};

// Mapping cho educationLevel
const educationLevelMap = {
  HIGH_SCHOOL: 'THPT',
  COLLEGE: 'Cao đẳng',
  UNIVERSITY: 'Đại học',
  MASTER: 'Thạc sĩ',
  DOCTOR: 'Tiến sĩ'
};

// Mapping cho jobLevel
const jobLevelMap = {
  INTERN: 'Thực tập sinh',
  FRESHER: 'Fresher',
  JUNIOR: 'Junior',
  MIDDLE: 'Middle',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  MANAGER: 'Manager'
};

// Mapping cho jobType
const jobTypeMap = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  FREELANCE: 'Freelance',
  REMOTE: 'Từ xa',
  INTERNSHIP: 'Thực tập'
};

const CandidateSearch = ({ onSelect }) => {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [filters, setFilters] = useState({
    location: null,
    jobLevel: null,
    jobType: null,
    experienceLevel: null,
    educationLevel: null
  });
  const [currentPackage, setCurrentPackage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch provinces
        const provincesResponse = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(provincesResponse.data);

        // Fetch employer data and jobs
        const employerUser = JSON.parse(localStorage.getItem("employer_user"));
        const employerData = await getEmployerByEmail(employerUser.email);
        const jobsData = await getJobsByEmployerId(employerData.id);
        const approvedJobs = jobsData.filter(job => job.approved);
        setJobs(approvedJobs);

        // Fetch candidates
        const candidatesData = await getAllCandidates();
        setCandidates(candidatesData);

        // Fetch current package
        const packageData = await getCurrentPackage(employerData.id);
        setCurrentPackage(packageData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMatchScore = (candidate, job) => {
    let score = 0;
    let totalCriteria = 6; // Giảm xuống còn 6 tiêu chí chính

    // 1. So sánh kinh nghiệm (trọng số cao)
    if (job.requiredExperienceLevel === candidate.experienceLevel) {
      score += 1;
    } else {
      const experienceLevels = [
        'NO_EXPERIENCE',
        'LESS_THAN_1_YEAR',
        'ONE_TO_THREE_YEARS',
        'THREE_TO_FIVE_YEARS',
        'FIVE_TO_TEN_YEARS',
        'MORE_THAN_TEN_YEARS'
      ];
      const jobIndex = experienceLevels.indexOf(job.requiredExperienceLevel);
      const candidateIndex = experienceLevels.indexOf(candidate.experienceLevel);
      // Nới lỏng: cho phép chênh lệch 2 bậc
      if (Math.abs(jobIndex - candidateIndex) <= 2) {
        score += 0.5;
      }
    }

    // 2. So sánh học vấn
    if (job.requiredEducationLevel === candidate.educationLevel) {
      score += 1;
    } else {
      const educationLevels = [
        'HIGH_SCHOOL',
        'COLLEGE',
        'UNIVERSITY',
        'MASTER',
        'DOCTOR'
      ];
      const jobIndex = educationLevels.indexOf(job.requiredEducationLevel);
      const candidateIndex = educationLevels.indexOf(candidate.educationLevel);
      // Chấp nhận bằng cấp thấp hơn 1 bậc hoặc cao hơn
      if (candidateIndex >= jobIndex - 1) {
        score += 0.5;
      }
    }

    // 3. So sánh ngành nghề và kỹ năng (gộp thành 1 tiêu chí)
    if (job.industryName === candidate.industryName) {
      score += 1;
    } else if (candidate.candidateSkills && candidate.candidateSkills.length > 0 &&
               job.jobSkills && job.jobSkills.length > 0 &&
               candidate.candidateSkills.some(candidateSkill =>
                 job.jobSkills.some(jobSkill => 
                   jobSkill.skillId === candidateSkill.skillId
                 )
               )) {
      score += 0.75; // Có kỹ năng phù hợp nhưng khác ngành
    }

    // 4. So sánh cấp bậc
    if (job.requiredJobLevel === candidate.jobLevel) {
      score += 1;
    } else {
      const jobLevels = [
        'INTERN',
        'FRESHER',
        'JUNIOR',
        'MIDDLE',
        'SENIOR',
        'LEAD',
        'MANAGER'
      ];
      const jobIndex = jobLevels.indexOf(job.requiredJobLevel);
      const candidateIndex = jobLevels.indexOf(candidate.jobLevel);
      // Nới lỏng: cho phép chênh lệch 2 bậc
      if (Math.abs(jobIndex - candidateIndex) <= 2) {
        score += 0.5;
      }
    }

    // 5. So sánh địa điểm và loại công việc (gộp thành 1 tiêu chí)
    if (job.location === candidate.location && job.requiredJobType === candidate.jobType) {
      score += 1;
    } else if (job.location === candidate.location || job.requiredJobType === candidate.jobType) {
      score += 0.5; // Chỉ phù hợp 1 trong 2
    }

    // 6. So sánh mức lương
    if (candidate.expectedSalary <= job.salary) {
      score += 1;
    } else if (candidate.expectedSalary <= (job.salary + (job.salary / 3))) { // Nới lỏng lên 33%
      score += 0.5;
    }

    // Tính phần trăm phù hợp
    return Math.round((score / totalCriteria) * 100);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'experienceLevel',
      key: 'experienceLevel',
      render: (text) => experienceLevelMap[text] || text,
    },
    {
      title: 'Học vấn',
      dataIndex: 'educationLevel',
      key: 'educationLevel',
      render: (text) => educationLevelMap[text] || text,
    },
    {
      title: 'Độ phù hợp',
      key: 'matchScore',
      render: (_, record) => {
        const score = record.matchScore || calculateMatchScore(record, selectedJob);
        let color = score >= 80 ? 'green' : score >= 50 ? 'orange' : 'red';
        return <Tag color={color}>{score}%</Tag>;
      },
      sorter: (a, b) => (a.matchScore || 0) - (b.matchScore || 0),
      defaultSortOrder: 'descend'
    }
  ];

  const handleJobChange = (jobId) => {
    const selectedJob = jobs.find(job => job.id === jobId);
    setSelectedJob(selectedJob);
  };

  const handleFilterChange = (value, type) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const getLocationName = (locationCode) => {
    const province = provinces.find(p => String(p.code) === String(locationCode));
    return province ? province.name : locationCode;
  };

  const getMaxCandidates = (packageId) => {
    switch (packageId) {
      case 1: return 5;
      case 2: return 20;
      case 3: return Infinity;
      default: return 0;
    }
  };

  const filteredCandidates = selectedJob 
    ? candidates
        .filter(candidate => {
          // Áp dụng các bộ lọc
          if (filters.location && candidate.location !== filters.location) return false;
          if (filters.jobLevel && candidate.jobLevel !== filters.jobLevel) return false;
          if (filters.jobType && candidate.jobType !== filters.jobType) return false;
          if (filters.experienceLevel && candidate.experienceLevel !== filters.experienceLevel) return false;
          if (filters.educationLevel && candidate.educationLevel !== filters.educationLevel) return false;
          
          // Tính điểm phù hợp và chỉ hiển thị >= 70%
          const matchScore = calculateMatchScore(candidate, selectedJob);
          return matchScore >= 70;
        })
        .map(candidate => ({
          ...candidate,
          matchScore: calculateMatchScore(candidate, selectedJob)
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, getMaxCandidates(currentPackage?.packageId)) // Limit based on package
    : [];

  return (
    <div>
      {currentPackage?.packageId !== 3 && (
        <Card style={{ marginBottom: 16 }}>
          <p>Gói dịch vụ hiện tại của bạn cho phép xem tối đa {getMaxCandidates(currentPackage?.packageId)} ứng viên phù hợp nhất.</p>
        </Card>
      )}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn tin tuyển dụng"
                onChange={handleJobChange}
              >
                {jobs.map(job => (
                  <Option key={job.id} value={job.id}>
                    {job.title}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="Tỉnh thành"
                onChange={(value) => handleFilterChange(value, 'location')}
                allowClear
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={province.name}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="Cấp bậc"
                onChange={(value) => handleFilterChange(value, 'jobLevel')}
                allowClear
              >
                {Object.entries(jobLevelMap).map(([key, value]) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="Loại công việc"
                onChange={(value) => handleFilterChange(value, 'jobType')}
                allowClear
              >
                {Object.entries(jobTypeMap).map(([key, value]) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>

        <Table
          columns={columns}
          dataSource={filteredCandidates}
          loading={loading}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => onSelect(record)
          })}
        />
      </Space>
    </div>
  );
};

export default CandidateSearch; 