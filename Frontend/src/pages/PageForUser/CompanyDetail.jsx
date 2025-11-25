import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import Footer from '../../components/user/common/Footer';
import { CompanyDetailComponents } from '../../components/user/companyDetail/CompanyDetailComponents';
import { getEmployerById } from '../../api/employerApi'; 

// Trang chi tiết công ty
const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập loading khi component mount
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getEmployerById(id); // Sử dụng API để lấy thông tin công ty theo ID
                setCompany(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin công ty:", error.response ? error.response.data : error);
            }
        };

        fetchCompany();
    }, [id]);

    if (!company) {
        return <div>Đang tải thông tin công ty...</div>;
    }
    if (loading) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#f0f2f5'
            }}>
                <Spin size="large" tip="Đang tải thông tin công ty..." />
            </div>
        );
    }
    return (
        <div>
            <CompanyDetailComponents company={company} />
            <Footer />
        </div>
    );
};

export default CompanyDetail;
