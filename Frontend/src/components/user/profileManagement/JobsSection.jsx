import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Tabs, List, Card, Button, Typography, Space, message, Empty, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { HeartFilled, EnvironmentOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { getApplicationsByCandidateId } from '../../../api/applicationApi';
import { AuthContext } from '../../auth/AuthProvider';
import { getCandidateProfileByEmail, getSavedJobs, unsaveJob } from '../../../api/candidateApi';

const { Text } = Typography;

const JobsSection = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.email) {
          const data = await getCandidateProfileByEmail(user.email);
          setProfile(data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin profile:', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        if (profile?.id) {
          console.log('Fetching applications for candidateId:', profile.id);
          const applications = await getApplicationsByCandidateId(profile.id);
          console.log('Applications received:', applications);
          setAppliedJobs(applications);
        } else {
          console.log('No profile id available');
        }
      } catch (error) {
        console.error('Error details:', error);
        message.error('Có lỗi xảy ra khi tải danh sách việc làm đã ứng tuyển');
      }
    };

    fetchAppliedJobs();
  }, [profile]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (profile?.id) {
        const data = await getSavedJobs(profile.id);
        setSavedJobs(data);
      }
    };
    fetchSavedJobs();
  }, [profile]);

  const getLocationName = (locationCode) => {
    if (!provinces.length) return locationCode;
    const province = provinces.find(p => String(p.code) === String(locationCode));
    return province ? province.name : locationCode;
  };

  const handleUnsaveJob = async (jobToRemove) => {
    try {
      await unsaveJob(profile.id, jobToRemove.id);
      setSavedJobs(savedJobs.filter(job => job.id !== jobToRemove.id));
      message.success('Đã hủy lưu việc làm');
    } catch (error) {
      message.error('Có lỗi xảy ra khi hủy lưu việc làm');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return { color: 'orange' }; // Màu cam cho trạng thái đang chờ
      case 'Accepted':
        return { color: 'green' }; // Màu xanh lá cho trạng thái đã chấp nhận
      case 'Rejected':
        return { color: 'red' }; // Màu đỏ cho trạng thái đã từ chối
      default:
        return { color: 'black' }; // Mặc định là màu đen
    }
  };

  return (
    <div className="jobs-section" style={{ padding: '20px' }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Việc làm đã ứng tuyển" key="1">
          <List
            loading={loading}
            dataSource={appliedJobs}
            renderItem={application => (
              <Card style={{ marginBottom: 16, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <List.Item style={{ display: 'block' }}>
                  <Link to={`/jobDetail/${application.jobId}`} style={{ textDecoration: 'none', color: '#333' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{application.jobTitle}</h3>
                        <Space direction="vertical" size="small">
                          <Text style={getStatusColor(application.status)}>
                            Trạng thái: {application.status === 'Pending' ? 'Đang chờ' : application.status}
                          </Text>
                          <Text>Ngày ứng tuyển: {new Date(application.createdDate).toLocaleDateString('vi-VN')}</Text>
                        </Space>
                      </div>
                    </div>
                  </Link>
                </List.Item>
              </Card>
            )}
            locale={{ emptyText: 'Chưa có việc làm nào được ứng tuyển' }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Việc làm đã lưu" key="2">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : savedJobs.length > 0 ? (
            <List
              dataSource={savedJobs}
              renderItem={job => (
                <Card 
                  style={{ 
                    marginBottom: 16,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                  hoverable
                >
                  <List.Item style={{ padding: 0 }}>
                    <Link 
                      to={`/jobDetail/${job.id}`} 
                      style={{ 
                        textDecoration: 'none', 
                        color: 'inherit',
                        width: '100%'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '15px',
                          flex: 1
                        }}>
                          <img
                            src={job.companyLogo}
                            alt={job.title}
                            style={{
                              width: '70px',
                              height: '70px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #eee'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h3 style={{ 
                              margin: '0 0 8px 0',
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a1a1a'
                            }}>
                              {job.title}
                            </h3>
                            <Space size="middle">
                              <Text type="secondary">
                                <EnvironmentOutlined /> {getLocationName(job.location)}
                              </Text>
                              <Text type="secondary">
                                <DollarOutlined /> {new Intl.NumberFormat('vi-VN', { 
                                  style: 'currency', 
                                  currency: 'VND' 
                                }).format(job.salary)}
                              </Text>
                              <Text type="secondary">
                                <ClockCircleOutlined /> {
                                  job.requiredJobType === 'FULL_TIME' ? 'Toàn thời gian' :
                                  job.requiredJobType === 'PART_TIME' ? 'Bán thời gian' :
                                  'Thời vụ'
                                }
                              </Text>
                            </Space>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleUnsaveJob(job);
                          }}
                          icon={<HeartFilled style={{ color: '#cc0a9d' }}/>}
                          style={{
                            border: '1px solid #cc0a9d',
                            borderRadius: '6px',
                            color: '#cc0a9d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#cc0a9d';
                            e.currentTarget.style.color = 'white';
                            const icon = e.currentTarget.querySelector('.anticon');
                            if (icon) icon.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#cc0a9d';
                            const icon = e.currentTarget.querySelector('.anticon');
                            if (icon) icon.style.color = '#cc0a9d';
                          }}
                        >
                          Hủy lưu
                        </Button>
                      </div>
                    </Link>
                  </List.Item>
                </Card>
              )}
            />
          ) : (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center',
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    Chưa có việc làm nào được lưu
                  </Text>
                }
              />
            </div>
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default JobsSection;
