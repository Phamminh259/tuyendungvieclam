import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Divider,
  Steps,
  message,
  Row,
  Col,
  Empty,
  Spin,
  Modal,
} from "antd";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { paymentApi } from "../../../../api/paymentApi";
import PaymentProcessing from "./PaymentProcessing";
import PackageDetails from "./PackageDetails";
import { cancelSubscription } from "../../../../api/subscriptionApi";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const { Title, Text } = Typography;
const { Step } = Steps;

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [packageInfo, setPackageInfo] = useState(null);
  const vatRate = 0;
  const [{ isPending }] = usePayPalScriptReducer();

  useEffect(() => {
    const fetchPackageInfo = async () => {
      try {
        setLoading(true);
        const storedPackage = localStorage.getItem("selected_package");

        if (storedPackage) {
          const parsedPackage = JSON.parse(storedPackage);
          console.log("Stored package info:", parsedPackage);
          setPackageInfo(parsedPackage);
        } else {
          message.error("Không tìm thấy thông tin gói");
          navigate("/homeEmployer");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        message.error("Không thể tải thông tin gói dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageInfo();
  }, [navigate]);

  // Thanh toán qua VNPay
  const handleVNPayPayment = async () => {
    try {
      setLoading(true);
      const paymentResponse = await paymentApi.createPayment({
        subscriptionId: packageInfo.subscriptionId,
        amount: packageInfo.price * (1 + vatRate),
        paymentMethod: "VNPAY",
      });

      if (paymentResponse?.url) {
        setPaymentUrl(paymentResponse.url);
        setShowProcessing(true);
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (error) {
      console.error("VNPay payment error:", error);
      message.error("Có lỗi xảy ra khi thanh toán qua VNPay");
    } finally {
      setLoading(false);
    }
  };

  // Hủy mua gói dịch vụ
  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const subscriptionId = packageInfo.subscriptionId;
      if (!subscriptionId)
        throw new Error("Không tìm thấy thông tin subscription");
      await cancelSubscription(subscriptionId);
      message.success("Mua gói dịch vụ đã được hủy thành công.");
      navigate("/homeEmployer");
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      message.error("Có lỗi xảy ra khi hủy mua gói dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  // Quay lại danh sách gói
  const handleBackToPackages = () => {
    Modal.confirm({
      title: "Xác nhận hủy gói dịch vụ",
      content: "Bạn có chắc chắn muốn hủy mua gói dịch vụ không?",
      okText: "Hủy gói",
      cancelText: "Quay lại",
      onOk: handleCancelSubscription,
    });
  };

  // Thanh toán qua PayPal
  const handlePayPalPayment = async () => {
    try {
      setLoading(true);
      console.log("Starting PayPal payment...");
      
      const paymentResponse = await paymentApi.createPayment({
        subscriptionId: packageInfo.subscriptionId,
        amount: packageInfo.price * (1 + vatRate),
        paymentMethod: "PAYPAL"
      });

      if (paymentResponse?.url) {
        localStorage.setItem('pending_subscription_id', packageInfo.subscriptionId.toString());
        window.location.href = paymentResponse.url;
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (error) {
      console.error("PayPal error:", error);
      message.error("Có lỗi xảy ra khi thanh toán qua PayPal");
    } finally {
      setLoading(false);
    }
  };

  if (showProcessing) {
    return <PaymentProcessing paymentUrl={paymentUrl} />;
  }

  return (
    <div className="checkout-container">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={handleBackToPackages}
        style={{ marginBottom: 16 }}
      >
        Quay lại danh sách gói
      </Button>

      <Card className="checkout-card">
        <Steps
          current={1}
          items={[
            {
              title: "Chọn gói",
              icon: <ShoppingCartOutlined />,
            },
            {
              title: "Thanh toán",
              icon: <CreditCardOutlined />,
            },
            {
              title: "Hoàn thành",
              icon: <CheckCircleOutlined />,
            },
          ]}
          style={{ marginBottom: 40 }}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {loading ? (
              <Card>
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Spin size="large" />
                  <div style={{ marginTop: "10px" }}>
                    Đang tải thông tin gói...
                  </div>
                </div>
              </Card>
            ) : packageInfo ? (
              <PackageDetails packageData={packageInfo} />
            ) : (
              <Card>
                <Empty description="Không tìm thấy thông tin gói" />
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            {packageInfo && (
              <Card
                title={<Title level={4}>Thông tin thanh toán</Title>}
                className="payment-method-card"
              >
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  {/* Tóm tắt gói */}
                  <div className="package-summary">
                    <Title level={5}>{packageInfo.packageName}</Title>
                    <Space>
                      <ClockCircleOutlined />
                      <Text>Thời hạn: {packageInfo.duration} ngày</Text>
                    </Space>
                  </div>

                  <Divider />

                  {/* Chi tiết giá */}
                  <div className="price-details">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text>Giá gói:</Text>
                      </Col>
                      <Col>
                        <Text strong>
                          {packageInfo.price?.toLocaleString("vi-VN")} VND
                        </Text>
                      </Col>
                    </Row>
                    <Row
                      justify="space-between"
                      align="middle"
                      style={{ marginTop: 8 }}
                    >
                      <Col>
                        <Text>Thuế VAT ({vatRate * 100}%):</Text>
                      </Col>
                      <Col>
                        <Text strong>
                          {(packageInfo.price * vatRate)?.toLocaleString("vi-VN")} VND
                        </Text>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* Tổng tiền */}
                  <div className="total-amount">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Tổng cộng:</Text>
                      </Col>
                      <Col>
                        <Title
                          level={3}
                          style={{ margin: 0, color: "#1890ff" }}
                        >
                          {(packageInfo.price * (1 + vatRate))?.toLocaleString("vi-VN")} VND
                        </Title>
                      </Col>
                    </Row>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div className="payment-method">
                    <Title level={5}>Phương thức thanh toán</Title>
                    
                    {/* VNPay option */}
                    <div className="payment-option" onClick={handleVNPayPayment}>
                      <img
                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0cb6rjka67v1685959226087.jpg"
                        alt="VNPay"
                        style={{ height: 40 }}
                      />
                      <Text>Thanh toán qua VNPay</Text>
                    </div>

                    {/* PayPal option */}
                    <div className="payment-option">
                      <Button 
                        type="link" 
                        onClick={handlePayPalPayment}
                        loading={loading}
                        style={{ width: '100%', height: 'auto', padding: '16px' }}
                      >
                        <Space>
                          <img
                            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                            alt="PayPal"
                            style={{ height: 40 }}
                          />
                          <Text>Thanh toán qua PayPal</Text>
                        </Space>
                      </Button>
                    </div>
                  </div>

                  {/* Thông tin bảo mật */}
                  <div className="secure-payment">
                    <SafetyCertificateOutlined
                      style={{ fontSize: 24, color: "#52c41a" }}
                    />
                    <Text type="secondary">
                      Thanh toán an toàn qua cổng VNPay
                    </Text>
                  </div>

                  {/* Điều khoản */}
                  <div style={{ textAlign: "center" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Bằng việc tiếp tục, bạn đồng ý với{" "}
                      <a href="#">điều khoản sử dụng</a>
                    </Text>
                  </div>
                </Space>
              </Card>
            )}
          </Col>
        </Row>
      </Card>

      <style jsx>{`
        .checkout-container {
          max-width: 1200px;
          margin: 50px auto;
          padding: 0 20px;
        }
        .checkout-card {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .payment-method-card {
          border-radius: 8px;
          height: 100%;
        }
        .package-summary {
          text-align: center;
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        .price-details {
          background-color: #fafafa;
          padding: 16px;
          border-radius: 8px;
        }
        .total-amount {
          background-color: #e6f7ff;
          padding: 16px;
          border-radius: 8px;
        }
        .payment-option {
          margin-bottom: 16px;
          padding: 16px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .payment-option:hover {
          border-color: #1890ff;
          background-color: #f8f9fa;
        }
        .payment-option img {
          object-fit: contain;
        }
        .secure-payment {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background-color: #f6ffed;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default Checkout;


