import React, { useState, useEffect } from 'react';
import FilterJobs from '../../components/user/job/FilterJobs';
import ListJobs from '../../components/user/job/ListJobs';
import Footer from '../../components/user/common/Footer';
import posts from '../../components/data/posts';
import { getAllJobs } from '../../api/jobApi';
import { getAllEmployers } from '../../api/employerApi';
import { Card, List, Avatar } from 'antd';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Trang Nganh Nghe/ Dia diem
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employers, setEmployers] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, employerData] = await Promise.all([
          getAllJobs(),
          getAllEmployers()
        ]);
        const activeAndApprovedJobs = jobData.filter(job => job.isActive && job.approved);
        setJobs(activeAndApprovedJobs);
        setFilteredJobs(activeAndApprovedJobs);
        setTotalJobs(activeAndApprovedJobs.length);
        setEmployers(employerData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFiltersChange = (filters) => {
    let results = [...jobs];

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.companyName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.industry) {
      results = results.filter(job => job.industryName === filters.industry);
    }

    if (filters.profession) {
      results = results.filter(job => job.professionName === filters.profession);
    }

    if (filters.location) {
      results = results.filter(job => String(job.location) === String(filters.location));
    }

    if (filters.level) {
      results = results.filter(job => job.requiredJobLevel === filters.level);
    }

    if (filters.experience) {
      results = results.filter(job => job.requiredExperienceLevel === filters.experience);
    }

    if (filters.education) {
      results = results.filter(job => job.requiredEducationLevel === filters.education);
    }

    if (filters.jobType) {
      results = results.filter(job => job.requiredJobType === filters.jobType);
    }

    if (filters.salary) {
      switch (filters.salary) {
        case 5000000:
          results = results.filter(job => job.salary < 5000000);
          break;
        case 10000000:
          results = results.filter(job => job.salary >= 5000000 && job.salary < 10000000);
          break;
        case 20000000:
          results = results.filter(job => job.salary >= 10000000 && job.salary < 20000000);
          break;
        case 50000000:
          results = results.filter(job => job.salary >= 20000000);
          break;
        default:
          break;
      }
    }

    if (filters.postedDate) {
      const now = new Date();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      switch (filters.postedDate) {
        case 'Hôm nay':
          results = results.filter(job => {
            const jobDate = new Date(job.createdDate);
            return now.toDateString() === jobDate.toDateString();
          });
          break;
        case '3 ngày':
          results = results.filter(job => {
            const jobDate = new Date(job.createdDate);
            return (now - jobDate) <= (3 * oneDayMs);
          });
          break;
        case '1 tuần':
          results = results.filter(job => {
            const jobDate = new Date(job.createdDate);
            return (now - jobDate) <= (7 * oneDayMs);
          });
          break;
        case '2 tuần':
          results = results.filter(job => {
            const jobDate = new Date(job.createdDate);
            return (now - jobDate) <= (14 * oneDayMs);
          });
          break;
        case '1 tháng':
          results = results.filter(job => {
            const jobDate = new Date(job.createdDate);
            return (now - jobDate) <= (30 * oneDayMs);
          });
          break;
        default:
          break;
      }
    }

    setFilteredJobs(results);
  };

  const handleCompanyClick = (companyId) => {
    navigate(`/companyDetail/${companyId}`);
  };

  if(loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" tip="Đang tải việc làm..." />
      </div>
    );
  }
  return (
    <div>
      <FilterJobs onFiltersChange={handleFiltersChange} />
      <div className="container mt-4">
        <div className="row">
          <div className="col-sm-9">
            <ListJobs 
              jobs={filteredJobs} 
              loading={loading} 
              totalJobs={totalJobs}
            />
          </div>
          <div className="col-sm-3" style={{ position: 'sticky', top: '20px', height: 'fit-content', paddingTop: '20px', paddingBottom: '20px'}}>
            {/* Công ty nổi bật */}
            <Card 
              className="mb-4" 
              title={<div style={{ color: '#cc0a9d', fontWeight: 'bold' }}>Công ty nổi bật</div>}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={employers}
                renderItem={employer => (
                  <List.Item 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCompanyClick(employer.id)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={employer.companyLogo || 'https://via.placeholder.com/40'} size={40} />}
                      title={
                        <span style={{ 
                          color: '#333', 
                          fontWeight: '500',
                          transition: 'color 0.3s'
                        }}>
                          {employer.companyName}
                        </span>
                      }
                      description={employer.industry}
                    />
                  </List.Item>
                )}
              />
            </Card>
            {/* Bài viết mới */}
            <Card 
              title={<div style={{ color: '#cc0a9d', fontWeight: 'bold' }}>Bài viết mới</div>}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <List
                itemLayout="vertical"
                dataSource={posts}
                renderItem={post => (
                  <List.Item style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                    <List.Item.Meta
                      title={
                        <a href="#" style={{ color: '#333', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>
                          {post.title}
                        </a>
                      }
                      description={
                        <div>
                          <div style={{ color: '#cc0a9d', fontSize: '12px', marginBottom: '4px' }}>
                            {post.category}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {post.description}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            {post.date}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
