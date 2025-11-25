import React, { useState, useEffect } from 'react';
import Footer from '../../components/user/common/Footer';
import FilterCompanies from '../../components/user/company/FilterCompanies';
import CompanyList from '../../components/user/company/CompanyList';
import { Spin } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Trang công ty
const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập loading khi component mount
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (locations) => {
    setSelectedLocations(locations);
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
        <Spin size="large" tip="Đang tải danh sách công ty..." />
      </div>
    );
  }

  return (
    <div>
      <div className="container mt-4">
        <div className="row mb-4 align-items-center">
          <div className="col-lg-9">
            <h3 className="mb-0">Nhà tuyển dụng hàng đầu</h3>
          </div>
          <div className="col-lg-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Tìm công ty..."
                aria-label="Tìm công ty"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <FilterCompanies onFilterChange={handleFilterChange} />
          </div>
          <div className="col-lg-9">
            <CompanyList 
              searchTerm={searchTerm} 
              selectedLocations={selectedLocations}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Companies;
