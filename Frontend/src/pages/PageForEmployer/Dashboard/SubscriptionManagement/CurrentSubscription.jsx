import React, { useState, useEffect, useContext } from "react";
import { Empty, Card, Button, List, Tag, Spin, message, Space, Typography, Modal, InputNumber } from "antd";
import { getCurrentPackage } from "../../../../api/subscriptionApi";
import { getPackageById } from "../../../../api/packageApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../components/auth/AuthProvider";
import { getPermissionIcon, formatPermissionValue, getPermissionTagColor } from '../../../../components/common/Permission';
import { API_URL } from '../../../../utils/config';
import axios from "axios";

const CurrentSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRenewModalVisible, setIsRenewModalVisible] = useState(false);
  const [renewDuration, setRenewDuration] = useState(1); // Mặc định 1 tháng
  const [renewLoading, setRenewLoading] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);

  useEffect(() => {
    const accountType = localStorage.getItem('accountType');
    const controller = new AbortController(); // Tạo controller để cancel request
  
    if (!user?.id || accountType !== 'employer') {
      setLoading(false);
      return;
    }
  
    fetchSubscriptions();
  
    return () => {
      controller.abort(); // Clean up khi component unmount
    };
  }, [user]); // Chỉ phụ thuộc vào user

  const handleNavigateToPackages = () => {
    // Chuyển đến trang HomeEmployer với tab packages được chọn
    window.open("/homeEmployer?tab=1", "_blank");
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const accountType = localStorage.getItem('accountType');
      const token = localStorage.getItem('employer_token');
      
      if (!token || accountType !== 'employer') {
        throw new Error('Unauthorized');
      }

      const data = await getCurrentPackage(user.id);
      console.log('Fetched subscription data:', data);

      if (data && data.isActive) {
        try {
          const packageDetails = await getPackageById(data.packageId);
          console.log('Package Details:', packageDetails);
          
          if (!packageDetails || !packageDetails.permissions) {
            throw new Error('Invalid package details or permissions');
          }
          
          setPackageDetails(packageDetails);
          setSubscriptions([{
            ...data,
            packageName: packageDetails.packageName,
            permissions: packageDetails.permissions,
            price: packageDetails.price
          }]);

        } catch (packageError) {
          console.error("Error fetching package details:", packageError);
          setSubscriptions([data]);
        }
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gia hạn và thanh toán
  const handleRenewAndPayment = async (subscriptionId) => {
    if (!renewDuration || renewDuration < 1) {
      message.error('Vui lòng nhập số tháng gia hạn hợp lệ');
      return;
    }

    setRenewLoading(true);
    try {
      // Bước 1: Gọi API gia hạn để tạo subscription mới
      const renewResponse = await axios.put(
        `${API_URL}/subscriptions/${subscriptionId}/renew`,
        null,
        {
          params: { duration: renewDuration * 30 },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('employer_token')}`
          }
        }
      );

      console.log('Renew Response:', renewResponse.data);
      
      // Kiểm tra response status
      if (renewResponse.data.status === 'OK' && renewResponse.data.url) {
        // Chuyển hướng đến URL thanh toán
        window.location.href = renewResponse.data.url;
        return;
      }

      // Nếu không có URL hoặc status không phải OK
      throw new Error(renewResponse.data.message || 'Không nhận được URL thanh toán');

    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể gia hạn gói dịch vụ: ' + (error.response?.data?.message || error.message));
    } finally {
      setRenewLoading(false);
      setIsRenewModalVisible(false);
    }
  };

  // Hàm tính tiền theo tháng
  const calculateTotalAmount = (monthlyPrice, durationInMonths) => {
    const durationInDays = durationInMonths * 30;
    return monthlyPrice * (durationInDays / 30.0);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!user) {
    return (
      <Empty description="Vui lòng đăng nhập để xem thông tin gói dịch vụ" />
    );
  }

  if (!user.id) {
    return <Empty description="Không tìm thấy thông tin nhà tuyển dụng" />;
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Empty description={<span>Bạn chưa đăng ký gói dịch vụ nào</span>}>
        <Button type="primary" onClick={handleNavigateToPackages}>
          Đăng ký ngay
        </Button>
      </Empty>
    );
  }

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={subscriptions}
      renderItem={(subscription) => (
        <List.Item>
          <Card title={`Gói ${subscription.packageName || packageDetails?.name || 'Không xác định'}`}>
            <p>
              <strong>Thời hạn:</strong> {calculateDuration(subscription.startDate, subscription.endDate)} ngày
            </p>
            <p>
              <strong>Ngày bắt đầu:</strong>{" "}
              {new Date(subscription.startDate).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Ngày kết thúc:</strong>{" "}
              {new Date(subscription.endDate).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              <Tag color="green">Đang hoạt động</Tag>
            </p>
            <div style={{ marginTop: 16 }}>
              <h4>Quyền lợi gói:</h4>
              <List
                size="small"
                dataSource={subscription.permissions || []}
                renderItem={(permission) => (
                  <List.Item>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <span style={{ color: '#1890ff', fontSize: '18px', width: '24px', display: 'inline-block' }}>
                          {getPermissionIcon(permission.permissionName)}
                        </span>
                        <Typography.Text>{permission.permissionName}</Typography.Text>
                      </Space>
                      <Tag color={getPermissionTagColor(permission.value, permission.permissionName)} style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                        {formatPermissionValue(permission.value, permission.permissionName)}
                      </Tag>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={handleNavigateToPackages}>
                Nâng cấp gói
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => setIsRenewModalVisible(true)}
              >
                Gia hạn
              </Button>
            </div>
          </Card>

          {/* Modal Gia hạn */}
          <Modal
            title="Gia hạn gói dịch vụ"
            open={isRenewModalVisible}
            onOk={() => handleRenewAndPayment(subscription.id)}
            onCancel={() => {
              setIsRenewModalVisible(false);
              setRenewDuration(1);
            }}
            confirmLoading={renewLoading}
            okText="Thanh toán ngay"
            cancelText="Hủy"
          >
            <div style={{ marginBottom: 16 }}>
              <p>Gói hiện tại: <strong>{subscription.packageName || packageDetails?.name || 'Không xác định'}</strong></p>
              <p>Giá/tháng: <strong>{subscription.price?.toLocaleString()} VNĐ</strong></p>
            </div>
            <div>
              <p>Chọn thời hạn gia hạn:</p>
              <InputNumber
                min={1}
                max={12}
                value={renewDuration}
                onChange={(value) => setRenewDuration(value)}
                formatter={(value) => `${value} tháng`}
                parser={(value) => value.replace(' tháng', '')}
                style={{ width: '100%' }}
              />
              <div style={{ marginTop: 8 }}>
                <p>Thời gian gia hạn: <strong>{renewDuration * 30} ngày</strong></p>
                <p>Tổng tiền: <strong>
                  {calculateTotalAmount(subscription.price, renewDuration)?.toLocaleString()} VNĐ
                </strong></p>
                <div style={{ fontSize: '12px', color: '#888', marginTop: 4 }}>
                  * Giá được tính theo công thức: Giá/tháng × (Số ngày gia hạn ÷ 30)
                </div>
              </div>
            </div>
          </Modal>
        </List.Item>
      )}
    />
  );
};

export default CurrentSubscription;
