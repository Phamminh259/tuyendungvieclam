import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined, DollarOutlined, CalendarOutlined, HeartOutlined, UserOutlined, FileTextOutlined, MailOutlined, PhoneOutlined, FieldTimeOutlined, BookOutlined, ClockCircleOutlined, ToolOutlined } from "@ant-design/icons";
import { getJobById, getAllJobs } from "../../../api/jobApi";
import { Menu, Modal, Button, Spin, message, Progress, Tag } from "antd";
import { AuthContext } from '../../auth/AuthProvider';
import { getCandidateProfileByEmail, getSavedJobs, unsaveJob, saveJob } from '../../../api/candidateApi';
import { createApplication, getApplicationsByCandidateId } from '../../../api/applicationApi';

const JobDetailCombined = ({ jobId }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("description");
  const [similarJobs, setSimilarJobs] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(jobId);
        setJob(jobData);
        await fetchSimilarJobs(jobData.industryName);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      if (user?.email) {
        try {
          const profile = await getCandidateProfileByEmail(user.email);
          setCandidateProfile(profile);
        } catch (error) {
          console.error('Error fetching candidate profile:', error);
          message.error('Không thể tải thông tin ứng viên');
        }
      }
    };

    fetchCandidateProfile();
  }, [user]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (candidateProfile?.id && jobId) {
        try {
          const applications = await getApplicationsByCandidateId(candidateProfile.id);
          console.log('Applications:', applications); // Debug log
          const hasAlreadyApplied = applications.some(app => String(app.jobId) === String(jobId));
          console.log('Has applied:', hasAlreadyApplied); // Debug log
          setHasApplied(hasAlreadyApplied);
        } catch (error) {
          console.error('Error checking application status:', error);
        }
      }
    };

    if (candidateProfile) {
      checkApplicationStatus();
    }
  }, [candidateProfile, jobId]);

  const getLocationName = (locationCode) => {
    const province = provinces.find(p => String(p.code) === String(locationCode));
    return province ? province.name : locationCode;
  };

  // Lấy công việc tương tự
  const fetchSimilarJobs = async (industryName) => {
    try {
      const allJobs = await getAllJobs();
      const filteredJobs = allJobs.filter(jobItem => jobItem.industryName === industryName && jobItem.id !== jobId);
      setSimilarJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching similar jobs:", error);
      setError("Không thể lấy danh sách công việc tương tự.");
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated || !user) {
      message.warning('Vui lòng đăng nhập để lưu công việc');
      navigate('/login');
      return;
    }
  
    try {
      if (!isSaved) {
        await saveJob(candidateProfile.id, job.id);
        setIsSaved(true);
        message.success('Đã lưu công việc thành công');
      } else {
        await unsaveJob(candidateProfile.id, job.id);
        setIsSaved(false);
        message.success('Đã hủy lưu công việc');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thực hiện thao tác');
    }
  };
  
  // Thêm useEffect để kiểm tra trạng thái đã lưu
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (candidateProfile?.id) {
        try {
          const savedJobs = await getSavedJobs(candidateProfile.id);
          const jobExists = savedJobs.some(savedJob => savedJob.id === parseInt(jobId));
          setIsSaved(jobExists);
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
  
    checkSavedStatus();
  }, [candidateProfile, jobId]);

  const handleApplyNow = () => {
    if (!isAuthenticated || !user) {
      message.warning('Vui lòng đăng nhập để ứng tuyển');
      navigate('/login');
      return;
    }

    if (hasApplied) {
      message.warning('Bạn đã nộp đơn cho công việc này.');
      return;
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const generateApplicationCode = () => {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `APP-${random}`;
  };

  const handleApplySubmit = async () => {
    try {
      if (!candidateProfile) {
        message.error('Vui lòng đăng nhập để ứng tuyển');
        return;
      }

      const applicationData = {
        code: generateApplicationCode(),
        jobId: job.id,
        candidateId: candidateProfile.id,
        status: 'Pending'
      };

      await createApplication(applicationData);
      setIsModalVisible(false);
      message.success({
        content: 'Ứng tuyển thành công!',
        duration: 3,
        style: {
          marginTop: '20vh',
        },
      });
      setHasApplied(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('Có lỗi xảy ra khi ứng tuyển');
    }
  };

  const calculateProfileCompletion = (profile) => {
    const totalFields = 8; // Tổng số trường cần kiểm tra
    let filledFields = 0;

    if (profile.fullName) filledFields++;
    if (profile.email) filledFields++;
    if (profile.phone) filledFields++;
    if (profile.address) filledFields++;
    if (profile.desiredPosition) filledFields++; // Đổi từ title thành desiredPosition
    if (profile.experienceLevel) filledFields++;
    if (profile.educationLevel) filledFields++;
    if (profile.expectedSalary) filledFields++;

    return Math.floor((filledFields / totalFields) * 100); // Sử dụng Math.floor để làm tròn xuống
  };

  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (candidateProfile) {
      const completion = calculateProfileCompletion(candidateProfile);
      setCompletionPercentage(completion);
    }
  }, [candidateProfile]);


  if (error) {
    return <div className="text-center mt-4"><p>Lỗi: {error}</p></div>;
  }

  if (!job) {
    return (
      <div className="text-center mt-4">
        <p>Không tìm thấy công việc.</p>
      </div>
    );
  }

  const menuItems = [
    { label: "Mô tả", key: "description", icon: <FileTextOutlined /> },
    { label: "Chi tiết công việc", key: "details", icon: <EnvironmentOutlined /> },
    { label: "Kỹ năng yêu cầu", key: "skills", icon: <UserOutlined /> },
    { label: "Liên hệ", key: "contact", icon: <DollarOutlined /> },
  ];

  const handleMenuClick = (e) => {
    const section = document.getElementById(e.key);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" tip="Đang tải thông tin công việc..." />
      </div>
    );
  }
  return (
    <div className="container-fluid text-center mt-4 d-flex justify-content-center">
      <div className="row w-100" style={{ maxWidth: '1200px' }}>
        <div className="col-md-8">
          <div className="card mb-4" style={{
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            border: 'none'
          }}>
            <div className="card-body" style={{ padding: '24px' }}>
              {/* Header Section */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px',
                marginBottom: '24px',
                padding: '16px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                {/* Company Logo */}
                <img
                  src={job.companyLogo}
                  alt="Company Logo"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    padding: '8px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                
                {/* Job Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    {job.title}
                  </h4>
                  
                  <div
                    onClick={() => {
                      if (job?.companyId) {
                        navigate(`/companyDetail/${job.companyId}`);
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: '500',
                      marginBottom: '16px',
                      color: '#cc0a9d'
                    }}
                  >
                    {job?.companyName || "Tên công ty không xác định"}
                  </div>

                  {/* Job Meta Info */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    fontSize: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <EnvironmentOutlined style={{ color: "#cc0a9d", fontSize: '18px' }} />
                      <span>{getLocationName(job.location)}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarOutlined style={{ color: "#cc0a9d", fontSize: '18px' }} />
                      <span style={{ fontWeight: '500', color: '#cc0a9d' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary)}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarOutlined style={{ color: "#cc0a9d", fontSize: '18px' }} />
                      <span>Hết hạn: {new Date(job.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '24px',
                padding: '0 16px'
              }}>
                <button 
                  className="btn btn-primary" 
                  style={{ 
                    background: hasApplied ? "#6c757d" : "linear-gradient(to right, #cc0a9d, #2d067d)",
                    border: 'none',
                    minWidth: '180px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '24px',
                    boxShadow: hasApplied ? 'none' : '0 4px 12px rgba(204, 10, 157, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleApplyNow}
                  disabled={hasApplied}
                >
                  {hasApplied ? 'Đã nộp đơn' : 'Nộp đơn ngay'}
                </button>

                <button 
                  className="btn" 
                  style={{ 
                    background: isSaved ? "#cc0a9d" : "white",
                    color: isSaved ? "white" : "#cc0a9d",
                    border: `2px solid ${isSaved ? '#cc0a9d' : '#cc0a9d'}`,
                    minWidth: '150px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleSaveJob}
                >
                  <HeartOutlined style={{ fontSize: '18px' }} />
                  {isSaved ? "Đã lưu" : "Lưu tin"}
                </button>
              </div>
            </div>
          </div>
          
          <div className="card mb-4 shadow-sm">
            <Menu
              mode="horizontal"
              selectedKeys={[activeSection]}
              onClick={handleMenuClick}
              items={menuItems.map((item) => ({
                ...item,
                style: activeSection === item.key ? { color: "rgb(204, 10, 157)", borderBottom: "2px solid rgb(204, 10, 157)" } : { color: "black", borderBottom: "none" },
              }))}
              style={{ borderBottom: "1px solid #ddd", background: "#fff", display: "flex", justifyContent: "center" }}
              className="custom-menu"
            />
            <div className="card-body">
              <div className="container mt-4 text-start">
                <section id="description" style={{ 
                  scrollMarginTop: "110px",
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h4 className="font-weight-bold" style={{
                    color: '#1a1a1a',
                    borderBottom: '2px solid #cc0a9d',
                    paddingBottom: '10px',
                    marginBottom: '20px'
                  }}>
                    Mô tả công việc
                  </h4>
                  <div style={{
                    whiteSpace: 'pre-line',
                    lineHeight: '1.8',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    {job.description}
                  </div>
                </section>
                <section id="details" style={{ 
                  scrollMarginTop: "110px",
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h4 className="font-weight-bold" style={{
                    color: '#1a1a1a',
                    borderBottom: '2px solid #cc0a9d',
                    paddingBottom: '10px',
                    marginBottom: '20px'
                  }}>
                    Thông tin chi tiết
                  </h4>
                  <ul className="list-unstyled" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px'
                  }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ minWidth: '120px' }}>Mã công việc:</strong>
                      <span>{job.code}</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ minWidth: '120px' }}>Chức danh:</strong>
                      <span>{job.professionName}</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ minWidth: '120px' }}>Ngành nghề:</strong>
                      <span>{job.industryName}</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ minWidth: '120px' }}>Địa điểm:</strong>
                      <span>{getLocationName(job.location)}</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ minWidth: '120px' }}>Mức lương:</strong>
                      <span style={{ color: '#cc0a9d', fontWeight: '500' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary)}
                      </span>
                    </li>
                  </ul>
                </section>
                <section id="skills" style={{ 
                  scrollMarginTop: "110px",
                  background: '#fff',
                  padding: '25px',
                  borderRadius: '12px',
                  marginTop: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h4 className="font-weight-bold" style={{
                    color: '#1a1a1a',
                    borderBottom: '2px solid #cc0a9d',
                    paddingBottom: '10px',
                    marginBottom: '25px'
                  }}>
                    Yêu cầu ứng viên
                  </h4>

                  {/* Grid layout cho các yêu cầu chính */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '20px',
                    marginBottom: '25px'
                  }}>
                    {/* Cấp độ công việc */}
                    <div style={{ 
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <UserOutlined style={{ color: '#cc0a9d', fontSize: '18px' }} />
                        <strong style={{ color: '#666' }}>Cấp độ:</strong>
                      </div>
                      <Tag color="blue" style={{ padding: '5px 12px', borderRadius: '4px' }}>
                        {job.requiredJobLevel === 'INTERN' && 'Thực tập sinh'}
                        {job.requiredJobLevel === 'FRESHER' && 'Sinh viên mới ra trường'}
                        {job.requiredJobLevel === 'JUNIOR' && 'Nhân viên'}
                        {job.requiredJobLevel === 'MIDDLE' && 'Nhân viên có kinh nghiệm'}
                        {job.requiredJobLevel === 'SENIOR' && 'Nhân viên cao cấp'}
                        {job.requiredJobLevel === 'LEAD' && 'Trưởng nhóm'}
                        {job.requiredJobLevel === 'MANAGER' && 'Quản lý'}
                      </Tag>
                    </div>

                    {/* Kinh nghiệm */}
                    <div style={{ 
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <FieldTimeOutlined style={{ color: '#cc0a9d', fontSize: '18px' }} />
                        <strong style={{ color: '#666' }}>Kinh nghiệm:</strong>
                      </div>
                      <Tag color="green" style={{ padding: '5px 12px', borderRadius: '4px' }}>
                        {job.requiredExperienceLevel === 'NO_EXPERIENCE' && 'Không yêu cầu kinh nghiệm'}
                        {job.requiredExperienceLevel === 'LESS_THAN_1_YEAR' && 'Dưới 1 năm'}
                        {job.requiredExperienceLevel === 'ONE_TO_THREE_YEARS' && '1-3 năm'}
                        {job.requiredExperienceLevel === 'THREE_TO_FIVE_YEARS' && '3-5 năm'}
                        {job.requiredExperienceLevel === 'FIVE_TO_TEN_YEARS' && '5-10 năm'}
                        {job.requiredExperienceLevel === 'MORE_THAN_TEN_YEARS' && 'Trên 10 năm'}
                      </Tag>
                    </div>

                    {/* Học vấn */}
                    <div style={{ 
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <BookOutlined style={{ color: '#cc0a9d', fontSize: '18px' }} />
                        <strong style={{ color: '#666' }}>Học vấn:</strong>
                      </div>
                      <Tag color="purple" style={{ padding: '5px 12px', borderRadius: '4px' }}>
                        {job.requiredEducationLevel === 'HIGH_SCHOOL' && 'Trung học'}
                        {job.requiredEducationLevel === 'COLLEGE' && 'Cao đẳng'}
                        {job.requiredEducationLevel === 'UNIVERSITY' && 'Đại học'}
                        {job.requiredEducationLevel === 'POSTGRADUATE' && 'Thạc sĩ'}
                        {job.requiredEducationLevel === 'DOCTORATE' && 'Tiến sĩ'}
                        {job.requiredEducationLevel === 'OTHER' && 'Khác'}
                      </Tag>
                    </div>

                    {/* Loại công việc */}
                    <div style={{ 
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <ClockCircleOutlined style={{ color: '#cc0a9d', fontSize: '18px' }} />
                        <strong style={{ color: '#666' }}>Loại công việc:</strong>
                      </div>
                      <Tag color="orange" style={{ padding: '5px 12px', borderRadius: '4px' }}>
                        {job.requiredJobType === 'FULL_TIME' && 'Toàn thời gian'}
                        {job.requiredJobType === 'PART_TIME' && 'Bán thời gian'}
                        {job.requiredJobType === 'SEASONAL' && 'Thời vụ'}
                      </Tag>
                    </div>
                  </div>

                  {/* Kỹ năng yêu cầu */}
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '15px'
                      }}>
                        <ToolOutlined style={{ color: '#cc0a9d', fontSize: '18px' }} />
                        <strong style={{ color: '#666' }}>Kỹ năng yêu cầu:</strong>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '10px' 
                      }}>
                        {job.skills.map((skill, index) => (
                          <Tag
                            key={index}
                            color="cyan"
                            style={{
                              padding: '6px 12px',
                              borderRadius: '16px',
                              fontSize: '14px'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span>{skill.skillName}</span>
                              <small style={{ 
                                fontSize: '12px', 
                                opacity: 0.8 
                              }}>
                                {skill.proficiencyLevel === 'BEGINNER' && 'Cơ bản'}
                                {skill.proficiencyLevel === 'INTERMEDIATE' && 'Trung bình'}
                                {skill.proficiencyLevel === 'ADVANCED' && 'Nâng cao'}
                                {skill.proficiencyLevel === 'EXPERT' && 'Chuyên sâu'}
                              </small>
                            </div>
                          </Tag>
                        ))}
                      </div>
                      
                      {/* Hiển thị mô tả kỹ năng nếu có */}
                      {job.skills.map((skill, index) => (
                        skill.description && (
                          <div 
                            key={index}
                            style={{
                              marginTop: '8px',
                              fontSize: '14px',
                              color: '#666',
                              paddingLeft: '28px'
                            }}
                          >
                            • {skill.skillName}: {skill.description}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </section>
                <section id="contact" style={{ 
                  scrollMarginTop: "110px",
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h4 className="font-weight-bold" style={{
                    color: '#1a1a1a',
                    borderBottom: '2px solid #cc0a9d',
                    paddingBottom: '10px',
                    marginBottom: '20px'
                  }}>
                    Thông tin liên hệ
                  </h4>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '10px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <MailOutlined style={{ 
                        fontSize: '20px', 
                        color: '#cc0a9d',
                        marginRight: '10px' 
                      }}/>
                      <div>
                        <div style={{ fontWeight: 500, color: '#666' }}>Email:</div>
                        <div style={{ 
                          color: '#1890ff',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}>
                          <a href={`mailto:${job.contactEmail}`}>
                            {job.contactEmail}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '10px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <PhoneOutlined style={{ 
                        fontSize: '20px', 
                        color: '#cc0a9d',
                        marginRight: '10px' 
                      }}/>
                      <div>
                        <div style={{ fontWeight: 500, color: '#666' }}>Hotline:</div>
                        <div style={{ 
                          color: '#1890ff',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}>
                          <a href={`tel:${job.companyPhone}`}>
                            {job.companyPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4" style={{ borderRadius: '10px' }}>
            <h5 className="mb-3">Việc tương tự</h5>
            {similarJobs.length === 0 ? (
              <p>Không tìm thấy công việc tương tự.</p>
            ) : (
              similarJobs.map((jobItem) => {
                return (
                  <div 
                    key={jobItem.id} 
                    className="mb-3" 
                    onClick={() => navigate(`/jobDetail/${jobItem.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <hr className="my-2" />
                    <div className="d-flex align-items-start">
                      <img
                        src={jobItem.companyLogo}
                        alt={jobItem.title}
                        className="me-3"
                        style={{ width: '100px', height: '40px', borderRadius: '5px' }}
                      />
                      <div className="text-start" style={{ flex: 1 }}>
                        <h6 className="mb-1" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                          {jobItem.title}
                        </h6>
                        <p className="mb-1" style={{ fontSize: '0.85rem', color: '#666' }}>
                          {jobItem.companyName}
                        </p>
                        <div className="d-flex align-items-center mb-1" style={{ fontSize: '0.8rem', color: '#666' }}>
                          <EnvironmentOutlined className="me-1" /> {getLocationName(jobItem.location)}
                        </div>
                        <div
                          className="d-flex align-items-center"
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgb(255, 99, 71)', 
                          }}
                        >
                          <DollarOutlined className="me-1" /> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(jobItem.salary) || 'Thương lượng'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Modal
        title={
          <div style={{ 
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px',
            marginLeft: -24,
            marginRight: -24,
            marginTop: -16,
            fontSize: '18px',
            fontWeight: 600,
            color: '#1a1a1a'
          }}>
            Ứng tuyển công việc
          </div>
        }
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1000}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        <h5 className="mt-4">Tỷ lệ hoàn thành hồ sơ: {Math.min(completionPercentage, 100).toFixed(0)}%</h5>
        <Progress percent={Math.min(completionPercentage, 100)} />

        <div className="row">
          {/* Cột trái - Thông tin công việc */}
          <div className="col-md-4" style={{ 
            borderRight: '1px solid #f0f0f0',
            padding: '20px'
          }}>
            <h5 className="mb-4" style={{ fontWeight: 600, color: '#1a1a1a' }}>
              Thông tin công việc
            </h5>
            <div className="job-info-card" style={{ 
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <h6 style={{ fontWeight: 600, marginBottom: '12px' }}>{job.title}</h6>
              <p className="mb-3" style={{ color: '#666' }}>{job.companyName}</p>
              <div className="info-item mb-3">
                <EnvironmentOutlined className="me-2" style={{ color: "rgb(204, 10, 157)" }} />
                <span>{getLocationName(job.location)}</span>
              </div>
              <div className="info-item mb-3">
                <DollarOutlined className="me-2" style={{ color: "rgb(204, 10, 157)" }} />
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary)}</span>
              </div>
              <div className="info-item">
                <CalendarOutlined className="me-2" style={{ color: "rgb(204, 10, 157)" }} />
                <span>Hạn nộp: {new Date(job.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Cột phải - Thông tin ứng viên */}
          <div className="col-md-8" style={{ padding: '20px' }}>
            <h5 className="mb-4" style={{ fontWeight: 600, color: '#1a1a1a' }}>
              Thông tin ứng viên
            </h5>
            {candidateProfile ? (
              <>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Họ và tên</label>
                      <p className="mb-0 fw-medium">{candidateProfile.fullName}</p>
                    </div>
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Email</label>
                      <p className="mb-0">{candidateProfile.email}</p>
                    </div>
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Số điện thoại</label>
                      <p className="mb-0">{candidateProfile.phone}</p>
                    </div>
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Địa chỉ</label>
                      <p className="mb-0">{candidateProfile.address}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Vị trí mong muốn</label>
                      <p className="mb-0">{candidateProfile.desiredPosition}</p>
                    </div>
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Kinh nghiệm</label>
                      <p className="mb-0">{candidateProfile.experienceLevel}</p>
                    </div>
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Học vấn</label>
                      <p className="mb-0">{candidateProfile.educationLevel}</p>
                    </div>
                    <div className="info-group mb-3">
                      <label className="text-muted mb-1">Mức lương mong muốn</label>
                      <p className="mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(candidateProfile.expectedSalary)}</p>
                    </div>
                  </div>
                </div>
                <div className="text-end" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                  <Button 
                    type="primary" 
                    onClick={handleApplySubmit}
                    size="large"
                    style={{ 
                      background: completionPercentage >= 80 
                        ? "linear-gradient(to right, rgb(2, 0, 36), rgb(204, 10, 157))"
                        : "#d9d9d9",
                      border: "none",
                      minWidth: "150px"
                    }}
                    disabled={completionPercentage < 80}
                  >
                    {completionPercentage < 80 ? 'Cần hoàn thiện hồ sơ trên 80%' : 'Xác nhận ứng tuyển'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Spin size="large" />
                <p className="mt-3">Đang tải thông tin...</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

JobDetailCombined.propTypes = {
  jobId: PropTypes.string.isRequired,
};

export default JobDetailCombined; 