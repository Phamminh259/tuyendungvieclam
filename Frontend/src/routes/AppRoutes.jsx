import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Các layouts
import Layout from '../pages/PageForUser/Layout';
import DashboardLayout from '../pages/PageForEmployer/Dashboard/DashboardLayout';
import AdminLayout from '../pages/PageForAdmin/Dashboard/AdminLayout';

// Các trang công khai
import Home from '../pages/PageForUser/Home';
import NotFound from '../pages/NotFound';
import ProfileManagement from '../pages/PageForUser/ProfileManagement';
import Companies from '../pages/PageForUser/Companies';
import CompanyDetailUser from '../pages/PageForUser/CompanyDetail';
import Jobs from '../pages/PageForUser/Jobs';
import JobDetail from '../pages/PageForUser/JobDetail';
import HomeEmployer from '../pages/PageForEmployer/HomeEmployer';
import Guide from '../pages/PageForUser/Guide';
import CVBuilder from '../pages/PageForUser/CVBuilder';

// Trang auth
import Login from '../pages/PageForUser/LoginForUser/Login';
import Register from '../pages/PageForUser/LoginForUser/Register';
import OAuth2RedirectHandler from '../components/auth/OAuth2RedirectHandler';
import LoginEmployer from '../pages/PageForEmployer/LoginForEmployer/LoginEmployer';
import RegisterEmployer from '../pages/PageForEmployer/LoginForEmployer/RegisterEmployer';
import AdminLogin from '../pages/PageForAdmin/LoginForAdmin/AdminLogin';

// Trang Dashboard Employer
import DashboardHome from '../pages/PageForEmployer/Dashboard/DashboardHome';
import JobPostManagement from '../pages/PageForEmployer/Dashboard/JobPostManagement';
import CVManagement from '../pages/PageForEmployer/Dashboard/CVManagement';
import CandidateManagement from '../pages/PageForEmployer/Dashboard/CandidateManagement';
import CompanyProfile from '../pages/PageForEmployer/Dashboard/CompanyManagement/CompanyProfile';
import AnalyticsEmployer from '../pages/PageForEmployer/Dashboard/Analytics';
import SubscriptionManagement from '../pages/PageForEmployer/Dashboard/SubscriptionManagement';
import AdminHome from '../pages/PageForAdmin/Dashboard/AdminHome';
import Checkout from '../pages/PageForEmployer/Dashboard/Checkout'; 
import PaymentResult from '../pages/PageForEmployer/Dashboard/Checkout/PaymentResult';
import PayPalCallback from '../pages/PageForEmployer/Dashboard/Checkout/PayPalCallback';

// Trang Dashboard Admin
import UserManagement from '../pages/PageForAdmin/Dashboard/UserManagement';
import PackageManagement from '../pages/PageForAdmin/Dashboard/PackageManagement';
import ContentManagement from '../pages/PageForAdmin/Dashboard/ContentManagement';
import SystemSettings from '../pages/PageForAdmin/Dashboard/SystemSettings';
import CompanyManagement from '../pages/PageForAdmin/Dashboard/CompanyManagement';
import CompanyDetailAdmin from '../pages/PageForAdmin/Dashboard/CompanyManagement/CompanyDetail';
import JobManagement from '../pages/PageForAdmin/Dashboard/JobManagement';
import AnalyticsAdmin from '../pages/PageForAdmin/Dashboard/Analytics';


import ForgotPassword from '../pages/PageForUser/LoginForUser/ForgotPassword';


const AppRoutes = ({ user, setUser }) => {
  return (
    <Routes>
      {/* Route công khai với Layout mặc định */}
      <Route element={<Layout user={user} setUser={setUser} />}>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companyDetail/:id" element={<CompanyDetailUser />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobDetail/:id" element={<JobDetail />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/cv-builder" element={<CVBuilder />} />
      </Route>

      {/* Route Profile Management */}
      <Route path="/profile/*" element={<ProfileManagement />} />

      {/* Route có HeaderJobsLayout */}
      {/* <Route element={<HeaderJobsLayout user={user} setUser={setUser} />}>
        
      </Route> */}

      {/* Route cho Employer Home */}
      <Route path="/homeEmployer" element={<HomeEmployer />} />

      {/* Trang Auth */}
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path="/login-employer" element={<LoginEmployer setUser={setUser} />} />
      <Route path="/register-employer" element={<RegisterEmployer />} />
      <Route path="/login-admin" element={<AdminLogin setUser={setUser} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Employer Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute userType="employer">
            <DashboardLayout user={user} />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="job-posts" element={<JobPostManagement />} />
        <Route path="cv-management" element={<CVManagement />} />
        <Route path="candidates" element={<CandidateManagement />} />
        <Route path="company" element={<CompanyProfile />} />
        <Route path="analytics" element={<AnalyticsEmployer />} />
        <Route path="subscription" element={<SubscriptionManagement />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute userType="admin">
            <AdminLayout user={user} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="company-management" element={<CompanyManagement />} />
        <Route path="job-management" element={<JobManagement />} />
        <Route path="package-management" element={<PackageManagement />} />
        <Route path="analytics" element={<AnalyticsAdmin />} />
        <Route path="content-management" element={<ContentManagement />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

      {/* Route fallback cho các trang không xác định */}
      <Route path="*" element={<NotFound />} />

      {/* Route cho Checkout */}
      <Route path="/employer/checkout" element={<Checkout />} />
      <Route path="/payment-result" element={<PaymentResult />} />
      <Route path="/paypal-callback" element={<PayPalCallback />} />
      {/* Route cho Management Company */}
      <Route path="/admin/companies/:id" element={<CompanyDetailAdmin />} />

    </Routes>
  );
};

AppRoutes.propTypes = {
  user: PropTypes.shape({
    full_name: PropTypes.string,
    account_type: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

export default AppRoutes;
