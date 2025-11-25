import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/user/common/Header.jsx';
import Footer from '../components/user/common/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const NotFound = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Trang bạn tìm kiếm không tồn tại</p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Về trang chủ
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound; 