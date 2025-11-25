import React, { useState, useEffect } from 'react';
import { Card, Carousel, Typography, Button, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getAllJobs } from '../../../api/jobApi';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const jobTypeMap = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  SEASONAL: 'Thời vụ'
};

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = React.useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await getAllJobs();
      
      // Lọc các job theo điều kiện mới
      const filteredJobs = allJobs
        .filter(job => 
          job.isActive && // đang hoạt động
          job.approved && // đã được duyệt
          job.isFeatured // là tin nổi bật
        )
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) // sắp xếp theo ngày tạo mới nhất
        .slice(0, 24); // chỉ lấy 24 job

      setJobs(filteredJobs);
    } catch (error) {
      message.error('Lỗi khi tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobDetail/${jobId}`);
  };

  return (
    <section style={{ padding: '50px 20px', background: '#f9f9f9' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        <Title level={2} style={{ 
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(to right, #2d067d, #cc0a9d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Việc làm nổi bật
        </Title>

        <Carousel
          autoplay
          autoplaySpeed={2000}
          dots={true}
          ref={carouselRef}
        >
          {/* Chia jobs thành các nhóm 8 jobs mỗi slide */}
          {Array.from({ length: Math.ceil(jobs.length / 8) }).map((_, slideIndex) => (
            <div key={slideIndex}>
              <div style={{ 
                display: 'grid',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '20px',
                padding: '10px 0'
              }}>
                {/* Hàng 1 */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px'
                }}>
                  {jobs.slice(slideIndex * 8, slideIndex * 8 + 4).map((job) => (
                    <Card
                      key={job.id}
                      hoverable
                      onClick={() => handleJobClick(job.id)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        height: '100%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '15px' 
                      }}>
                        <img
                          src={job.companyLogo || 'https://via.placeholder.com/48'}
                          alt={job.title}
                          style={{
                            width: '48px',
                            height: '48px',
                            marginRight: '15px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <Title level={5} style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.3',
                            minHeight: 'calc(1.3em * 2)',
                            wordBreak: 'break-word',
                          }}>
                            {job.title}
                          </Title>
                          <Text style={{ 
                            color: '#666',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.3',
                            minHeight: 'calc(1.3em * 2)',
                            wordBreak: 'break-word'
                          }}>
                            {job.companyName}
                          </Text>
                        </div>
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        <Text style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          color: '#666'
                        }}>
                          📍 {job.location}
                        </Text>
                        <Text style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          color: '#666'
                        }}>
                          💰 {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(job.salary)}
                        </Text>
                        <Text style={{ 
                          display: 'block', 
                          marginBottom: '12px',
                          color: '#666'
                        }}>
                          ⏰ {jobTypeMap[job.requiredJobType]}
                        </Text>
                      </div>
                      <Button
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn event bubble lên card
                          handleJobClick(job.id);
                        }}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to right, #2d067d, #cc0a9d)',
                          border: 'none',
                          height: '36px',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}
                      >
                        Ứng tuyển ngay
                      </Button>
                    </Card>
                  ))}
                </div>
                {/* Hàng 2 */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px'
                }}>
                  {jobs.slice(slideIndex * 8 + 4, slideIndex * 8 + 8).map((job) => (
                    <Card
                      key={job.id}
                      hoverable
                      onClick={() => handleJobClick(job.id)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        height: '100%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '15px' 
                      }}>
                        <img
                          src={job.companyLogo || 'https://via.placeholder.com/48'}
                          alt={job.title}
                          style={{
                            width: '48px',
                            height: '48px',
                            marginRight: '15px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <Title level={5} style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.3',
                            minHeight: 'calc(1.3em * 2)',
                            wordBreak: 'break-word',
                          }}>
                            {job.title}
                          </Title>
                          <Text style={{ 
                            color: '#666',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.3',
                            minHeight: 'calc(1.3em * 2)',
                            wordBreak: 'break-word'
                          }}>
                            {job.companyName}
                          </Text>
                        </div>
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        <Text style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          color: '#666'
                        }}>
                          📍 {job.location}
                        </Text>
                        <Text style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          color: '#666'
                        }}>
                          💰 {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(job.salary)}
                        </Text>
                        <Text style={{ 
                          display: 'block', 
                          marginBottom: '12px',
                          color: '#666'
                        }}>
                          ⏰ {jobTypeMap[job.requiredJobType]}
                        </Text>
                      </div>
                      <Button
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn event bubble lên card
                          handleJobClick(job.id);
                        }}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to right, #2d067d, #cc0a9d)',
                          border: 'none',
                          height: '36px',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}
                      >
                        Ứng tuyển ngay
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <style jsx>{`
        .ant-carousel .slick-dots li button {
          background: rgba(204, 10, 157, 0.3);
          height: 8px;
          width: 8px;
          border-radius: 50%;
        }

        .ant-carousel .slick-dots li.slick-active button {
          background: #cc0a9d;
        }

        .ant-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
      `}</style>
    </section>
  );
};

export default FeaturedJobs;
