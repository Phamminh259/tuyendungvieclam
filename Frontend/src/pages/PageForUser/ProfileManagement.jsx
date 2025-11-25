import React, { useState, useEffect, useContext } from 'react';
import { Layout, Alert, message, Spin } from 'antd';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/auth/AuthProvider';
import { getCandidateProfile } from '../../api/candidateApi';

// Components
import HeaderComponent from '../../components/user/common/Header';
import ProfileSidebar from '../../components/user/profileManagement/ProfileSidebar';
import ProfileSection from '../../components/user/profileManagement/ProfileSection';
import OverviewSection from '../../components/user/profileManagement/OverviewSection';
import CompanySection from '../../components/user/profileManagement/CompanySection';
import JobsSection from '../../components/user/profileManagement/JobsSection';
import NotificationsSection from '../../components/user/profileManagement/NotificationsSection';
import SettingsSection from '../../components/user/profileManagement/SettingsSection';

import '../../styles/ProfileManagement.css';

const { Content, Sider } = Layout;

const ProfileManagement = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!user.id) {
          throw new Error('Không tìm thấy id_account');
        }

        // Lấy profile với id_account
        const profileData = await getCandidateProfile(user.id);
        setProfile(profileData);
        
      } catch (error) {
        console.error('Lỗi khi lấy thông tin hồ sơ:', error);
        message.error('Lỗi khi lấy thông tin hồ sơ: ' + error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchProfile();

    return () => {
      // Logic cleanup ở đây
    };
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent />
      <Layout>
        <Sider width={250} className="profile-sider">
          <ProfileSidebar />
        </Sider>
        
        <Content className="profile-content">
          <Routes>
            <Route path="overview" element={<OverviewSection profile={profile} />} />
            <Route path="myprofile" element={<ProfileSection profile={profile} />} />
            <Route path="company" element={<CompanySection />} />
            <Route path="jobs" element={<JobsSection />} />
            <Route path="notifications" element={<NotificationsSection />} />
            <Route path="settings" element={<SettingsSection />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfileManagement;
