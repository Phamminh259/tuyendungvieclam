import React from 'react';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import Hero from '../../components/user/home/Hero';
import PopularCategories from '../../components/user/home/PopularCategories';
import FeaturedJobs from '../../components/user/home/FeaturedJobs';
import TopCompanies from '../../components/user/home/TopCompanies';
import Footer from '../../components/user/common/Footer';
import PendingVerificationAlert from '../../components/auth/PendingVerificationAlert';
import Banner from '../../components/user/home/Banner';
import useScrollAnimation from '../../utils/useScrollAnimation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../styles/Home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [heroRef, heroVisible] = useScrollAnimation();
  const [categoriesRef, categoriesVisible] = useScrollAnimation();
  const [jobsRef, jobsVisible] = useScrollAnimation();
  const [companiesRef, companiesVisible] = useScrollAnimation();
  const [bannerRef, bannerVisible] = useScrollAnimation();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" tip="Đang tải trang..." />
      </div>
    );
  }

  return (
    <div>
      <PendingVerificationAlert />
      
      <div ref={heroRef} className={`fade-in-section ${heroVisible ? 'is-visible' : ''}`}>
        <Hero />
      </div>

      <div ref={categoriesRef} className={`fade-in-section ${categoriesVisible ? 'is-visible' : ''}`}>
        <PopularCategories />
      </div>

      <div ref={jobsRef} className={`fade-in-section ${jobsVisible ? 'is-visible' : ''}`}>
        <FeaturedJobs />
      </div>

      <div ref={companiesRef} className={`fade-in-section ${companiesVisible ? 'is-visible' : ''}`}>
        <TopCompanies />
      </div>

      <div ref={bannerRef} className={`fade-in-section ${bannerVisible ? 'is-visible' : ''}`}>
        <Banner />
      </div>

      <Footer />
    </div>
  );
};

export default Home;