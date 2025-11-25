import React, { useState, useEffect } from "react";
import { Form, Input, Button, Steps, Row, Col, Select, Checkbox } from "antd";
import { registerEmployer } from "../../../api/authApi";
import { getAllIndustries } from "../../../api/industryApi";
import { message } from "antd";
import { motion } from "framer-motion";
import {
  TeamOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logos/logo.png";
import { useNavigate } from "react-router-dom";
import TermsAndConditions from "../../../components/Provision";
import OTPVerification from "./OTPVerification";

const { Step } = Steps;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});

  // State cho Quốc gia, Tỉnh/Thành phố, Quận/Huyện
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  // Lấy danh sách Tỉnh/Thành phố của Việt Nam
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((response) => response.json())
      .then((data) => {
        const provinceOptions = data
          .map((province) => ({
            label: province.name,
            value: province.code,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setProvinces(provinceOptions);
      })
      .catch((error) => console.error(error));
  }, []);

  // Lấy danh sách Quận/Huyện theo Tỉnh/Thành phố đã chọn
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((response) => response.json())
        .then((data) => {
          const districtOptions = data.districts
            .map((district) => ({
              label: district.name,
              value: district.code,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
          setDistricts(districtOptions);
        })
        .catch((error) => console.error(error));
    }
  }, [selectedProvince]);

  const [industries, setIndustries] = useState([]);

  // Thêm useEffect để lấy danh sách lĩnh vực nghề nghiệp
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await getAllIndustries();
        setIndustries(data);
      } catch (error) {
        message.error("Không thể lấy danh sách lĩnh vực nghề nghiệp!");
      }
    };
    fetchIndustries();
  }, []);

  // Thêm initialValues cho form
  const initialValues = {
    country: "Vietnam", // Set giá trị mặc định cho country
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);

  // Hàm xử lý khi nhấn nút tiếp tục
  const onNext = async () => {
    try {
      // Validate và lưu dữ liệu của bước hiện tại
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  // Hàm xử lý khi nhấn nút quay lại
  const onPrev = () => {
    setCurrentStep(currentStep - 1);
    // Khôi phục dữ liệu đã lưu cho bước trước
    form.setFieldsValue(formData);
  };

  // Hàm xử lý khi form được gửi
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const onFinish = async (values) => {
    if (!agreeTerms) {
      message.error("Bạn phải đồng ý với điều khoản để tiếp tục!");
      return;
    }

    try {
      const finalValues = { ...formData, ...values };

      // Tìm tên tỉnh/thành phố từ code
      const selectedProvinceName = 
        provinces.find((p) => p.value === finalValues.province)?.label || "";

      // Tìm tên quận/huyện từ code
      const selectedDistrictName =
        districts.find((d) => d.value === finalValues.district)?.label || "";

      // Kiểm tra ngành nghề
      const selectedIndustry = industries.find(
        (ind) => ind.id === finalValues.industry
      );
      if (!selectedIndustry) {
        message.error("Vui lòng chọn lĩnh vực ngành nghề hợp lệ!");
        return;
      }
      // Xử lý số điện thoại
      let phoneNumber = finalValues.phone;
      if (!phoneNumber.startsWith("84")) {
        phoneNumber = "84" + phoneNumber;
      }   

      const employerDTO = {
        // Thông tin đăng nhập
        email: finalValues.email,
        password: finalValues.password,
        confirmPassword: finalValues.confirmPassword,

        // Thông tin người liên hệ
        contactName: `${finalValues.lastName} ${finalValues.firstName}`.trim(),
        contactPhone: phoneNumber, // Sử dụng số điện thoại đã xử lý
        contactPosition: finalValues.position,

        // Thông tin công ty
        companyName: finalValues.companyName,
        companyPhone: finalValues.companyHotline,
        // Sử dụng tên thay vì code
        companyAddress: `${finalValues.address}, ${selectedDistrictName}, ${selectedProvinceName}`,

        // Thông tin khác
        location: selectedProvinceName,
        industry: selectedIndustry.name,
      };

      console.log("EmployerDTO before sending:", employerDTO);

      // Thay vì gọi API đăng ký ngay, lưu dữ liệu và hiển thị form OTP
      setRegistrationData(employerDTO);
      setShowOTPVerification(true);
    } catch (error) {
      console.error("Form processing error:", error);
      message.error("Có lỗi xảy ra khi xử lý form!");
    }
  };

  // Thêm hàm xử lý sau khi xác thực OTP thành công
  const handleVerificationSuccess = async () => {
    try {
      const response = await registerEmployer(registrationData);
      message.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );

      // Animation và chuyển trang
      const container = document.querySelector(".register-page");
      if (container) {
        container.style.transition = "all 0.5s ease";
        container.style.transform = "scale(0.95)";
        container.style.opacity = "0";
      }

      setTimeout(() => {
        navigate("/login-employer", {
          state: {
            registrationSuccess: true,
            email: registrationData.email,
          },
        });
      }, 500);
    } catch (error) {
      console.error("Registration error:", error);
      message.error("Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  // Animation cho nút quay về trang chủ
  const handleBackHome = () => {
    // Animation cho toàn b container
    const container = document.querySelector(".register-page");
    if (container) {
      container.style.transition = "all 0.5s ease";
      container.style.transform = "scale(0.95)";
      container.style.opacity = "0";
    }

    // Animation cho nút
    const button = document.querySelector(".home-button");
    if (button) {
      button.style.transform = "scale(0.9)";
    }

    // Chuyển trang sau khi animation hoàn tất
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Bên trái */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 4,
          background: "linear-gradient(to right, #020024, #cc0a9d)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo và animation nền */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Nội dung chính */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ color: "#fff", textAlign: "center", zIndex: 1 }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "2rem",
              background: "linear-gradient(45deg, #fff, #f0f0f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Chào mừng đến với TOP Việc Làm
          </h1>

          {/* Các điểm nổi bật */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div style={{ marginBottom: "2rem" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                }}
              >
                <TeamOutlined
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                />
                <h3>Tiếp cận ứng viên chất lượng</h3>
                <p>Kết nối với hàng nghìn ứng viên tiềm năng</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                }}
              >
                <RocketOutlined
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                />
                <h3>Đăng tin tuyển dụng dễ dàng</h3>
                <p>Công cụ quản lý tuyển dụng hiệu quả</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: "1rem",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                }}
              >
                <SafetyCertificateOutlined
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                />
                <h3>An toàn & Bảo mật</h3>
                <p>Thông tin của bạn luôn được bảo vệ</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Nút về trang chủ */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="home-button"
              type="default"
              ghost
              size="large"
              onClick={handleBackHome}
              style={{
                borderColor: "#fff",
                color: "#fff",
                marginTop: "2rem",
                padding: "0 2rem",
                height: "45px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
            >
              <motion.span initial={{ x: 0 }} whileHover={{ x: -5 }}>
                ←
              </motion.span>
              Quay về trang chủ
            </Button>
          </motion.div>
        </motion.div>

        {/* Particles animation */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [-20, window.innerHeight],
                x: Math.random() * window.innerWidth,
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                width: Math.random() * 5 + 2 + "px",
                height: Math.random() * 5 + 2 + "px",
                background: "#fff",
                borderRadius: "50%",
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bên phải */}
      <div
        style={{
          flex: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: "500px" }}>
          {showOTPVerification ? (
            <OTPVerification
              phone={registrationData.contactPhone}
              onVerificationSuccess={handleVerificationSuccess}
              onBack={() => setShowOTPVerification(false)}
            />
          ) : (
            <>
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Đăng ký
              </h2>
              <Steps
                current={currentStep}
                size="small"
                style={{ marginBottom: "20px" }}
              >
                <Step title="Liên lạc" />
                <Step title="Công ty" />
              </Steps>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={initialValues}
                style={{ width: "100%" }}
              >
                {currentStep === 0 && (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Tên"
                          name="firstName"
                          rules={[
                            { required: true, message: "Vui lòng nhập tên!" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Họ"
                          name="lastName"
                          rules={[
                            { required: true, message: "Vui lòng nhập họ!" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Chức vụ"
                      name="position"
                      rules={[
                        { required: true, message: "Vui lòng nhập chức vụ!" },
                      ]}
                    >
                      <Select placeholder="Chọn chức vụ">
                        <Option value="CEO">CEO</Option>
                        <Option value="HR Manager">Quản lý nhân sự</Option>
                        <Option value="HR Staff">Nhân viên nhân sự</Option>
                        <Option value="Manager">Quản lý</Option>
                        <Option value="Other">Khác</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Điện thoại"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại!",
                        },
                        {
                          pattern: /^(0|84)?[0-9]{9}$/,
                          message: "Số điện thoại không hợp lệ!",
                        },
                      ]}
                    >
                      <Input
                        addonBefore="+84"
                        placeholder="Nhập số điện thoại"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Nếu người dùng nhập 0 ở đầu, tự động bỏ số 0
                          if (value.startsWith("0")) {
                            value = value.substring(1);
                            form.setFieldsValue({ phone: value });
                          }
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Mật khẩu"
                      name="password"
                      rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu!" },
                        {
                          min: 6,
                          message: "Mật khẩu phải có ít nhất 6 ký tự!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Nhập lại mật khẩu"
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập lại mật khẩu!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Mật khẩu nhập lại không khớp!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item>
                      <Checkbox
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      >
                        Tôi đồng ý với{" "}
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            setTermsVisible(true);
                          }}
                          className="terms-link"
                          style={{
                            color: "#1890ff",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: 500,
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          điều khoản sử dụng
                          <span
                            style={{
                              position: "absolute",
                              top: -8,
                              right: -12,
                              color: "#ff4d4f",
                              fontSize: "16px",
                            }}
                          >
                            *
                          </span>
                        </a>
                      </Checkbox>
                    </Form.Item>
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <Form.Item
                      label="Tên công ty"
                      name="companyName"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên công ty!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Hotline công ty"
                      name="companyHotline"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số hotline!",
                        },
                        {
                          pattern: /^\d{10,11}$/,
                          message: "Số hotline không hợp lệ!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập số hotline của công ty" />
                    </Form.Item>

                    <Form.Item
                      label="Lĩnh vực"
                      name="industry"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn lĩnh vực!",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn lĩnh vực">
                        {industries.map((industry) => (
                          <Option key={industry.id} value={industry.id}>
                            {industry.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Địa chỉ công ty" required>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            name="province"
                            noStyle
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn tỉnh/thành phố!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Tỉnh/Thành phố"
                              options={provinces}
                              onChange={(value) => setSelectedProvince(value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="district"
                            noStyle
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn quận/huyện!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Quận/Huyện"
                              options={districts}
                              disabled={!selectedProvince}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="address"
                        style={{ marginTop: "10px" }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ cụ thể!",
                          },
                        ]}
                      >
                        <Input placeholder="Số nhà, phường/xã" />
                      </Form.Item>
                    </Form.Item>
                  </>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      currentStep > 0 ? "space-between" : "flex-end",
                    marginTop: "20px",
                  }}
                >
                  {currentStep > 0 && (
                    <Button onClick={onPrev} style={{ marginRight: "10px" }}>
                      Quay lại
                    </Button>
                  )}
                  {currentStep < 1 && (
                    <Button type="primary" onClick={onNext}>
                      Tiếp tục
                    </Button>
                  )}
                  {currentStep === 1 && (
                    <Button type="primary" htmlType="submit">
                      Hoàn tất
                    </Button>
                  )}
                </div>
              </Form>
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                Bạn đã có tài khoản? <a href="/login-employer">Đăng nhập</a>
              </p>
            </>
          )}
        </div>
      </div>

      <TermsAndConditions
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
      />
    </div>
  );
};

export default RegisterPage;
