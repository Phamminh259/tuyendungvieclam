import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Upload,
  message,
  Tabs,
  Statistic,
  Typography,
  Descriptions,
  Select,
  Empty,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  StopFilled,
} from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { getEmployerByEmail } from "../../../../api/employerApi";
import { updateEmployer } from "../../../../api/employerApi";
import { getAllIndustries } from "../../../../api/industryApi";
import "../../../../styles/CompanyProfile.css";
import uploadService from "../../../../api/uploadApi";
import { reloadPage } from "../../../../utils/pageUtils";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const StatusDisplay = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "ACTIVE":
        return {
          icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
          text: "Đang hoạt động",
          color: "#52c41a",
        };
      case "INACTIVE":
        return {
          icon: <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
          text: "Chưa hoạt động (đang chờ xác thực)",
          color: "#ff4d4f",
        };
      case "SUSPENDED":
        return {
          icon: <StopFilled style={{ color: "#faad14" }} />,
          text: "Tạm ngưng hoạt động",
          color: "#faad14",
        };
      default:
        return {
          icon: null,
          text: "Không xác định",
          color: "#d9d9d9",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {config.icon}
      <span style={{ color: config.color }}>{config.text}</span>
    </div>
  );
};

const CompanyProfile = () => {
  const [form] = Form.useForm();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [logoUrl, setLogoUrl] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const employerUser = localStorage.getItem("employer_user");
        if (!employerUser) {
          message.error("Vui lòng đăng nhập lại");
          return;
        }

        const userData = JSON.parse(employerUser);
        const data = await getEmployerByEmail(userData.email);

        setEmployer(data);
        setLogoUrl(data.companyLogo);

        // Set giá trị cho form
        form.setFieldsValue({
          companyName: data.companyName,
          companyLogo: data.companyLogo,
          companyAddress: data.companyAddress,
          companyPhone: data.companyPhone,
          companyWebsite: data.companyWebsite,
          companySize: data.companySize,
          taxCode: data.taxCode,
          industryId: data.industryId,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          contactPosition: data.contactPosition,
          businessLicense: data.businessLicense,
          companyDescription: data.companyDescription,
        });
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, [form]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const industriesData = await getAllIndustries();
        setIndustries(industriesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu industries:", error);
        message.error("Không thể lấy danh sách ngành nghề");
      }
    };
    fetchIndustries();
  }, []);

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

  useEffect(() => {
    if (employer && !loading) {
      // Tách địa chỉ thành các phần
      const addressParts = employer.companyAddress.split(", ");
      const districtName = addressParts[addressParts.length - 1]; // Lấy quận/huyện
      const detailAddress = addressParts.slice(0, -1).join(", "); // Địa chỉ chi tiết

      // Tìm province từ location
      const province = provinces.find((p) => p.label === employer.location);
      if (province) {
        setSelectedProvince(province.value);

        // Fetch districts cho province đã chọn
        fetch(`https://provinces.open-api.vn/api/p/${province.value}?depth=2`)
          .then((response) => response.json())
          .then((data) => {
            const districtOptions = data.districts
              .map((district) => ({
                label: district.name,
                value: district.code,
              }))
              .sort((a, b) => a.label.localeCompare(b.label));
            setDistricts(districtOptions);

            // Tìm và set district
            const district = districtOptions.find(
              (d) => d.label === districtName
            );
            if (district) {
              form.setFieldsValue({
                province: province.value,
                district: district.value,
                address: detailAddress,
              });
            }
          });
      }

      // Tìm và set industry
      const currentIndustry = industries.find(
        (ind) => ind.name === employer.industryName
      );
      if (currentIndustry) {
        form.setFieldsValue({
          industryId: currentIndustry.id,
        });
      }

      // Set các giá trị khác cho form
      form.setFieldsValue({
        companyName: employer.companyName,
        companyPhone: employer.companyPhone,
        companyWebsite: employer.companyWebsite,
        companySize: employer.companySize,
        taxCode: employer.taxCode,
        businessLicense: employer.businessLicense,
        contactName: employer.contactName,
        contactPhone: employer.contactPhone,
        contactEmail: employer.contactEmail,
        contactPosition: employer.contactPosition,
      });
    }
  }, [employer, provinces, industries, form, loading]);

  const handleUpdate = async (values) => {
    try {
      // Tìm tên tỉnh/thành phố và quận/huyện
      const selectedProvinceName = provinces.find(
        (p) => p.value === values.province
      )?.label;
      const selectedDistrictName = districts.find(
        (d) => d.value === values.district
      )?.label;

      if (!selectedProvinceName || !selectedDistrictName) {
        message.error("Vui lòng chọn đầy đủ địa chỉ!");
        return;
      }

      // Tạo địa chỉ đầy đủ từ các thành phần
      const fullAddress = `${values.address}, ${selectedDistrictName}`;

      const updateData = {
        companyName: values.companyName,
        companyAddress: fullAddress, // Địa chỉ chi tiết + quận/huyện
        companyPhone: values.companyPhone,
        companyWebsite: values.companyWebsite || null,
        companySize: values.companySize,
        taxCode: values.taxCode,
        industryId: parseInt(values.industryId),
        companyDescription: values.companyDescription || null,
        location: selectedProvinceName, // Chỉ lưu tỉnh/thành phố
        businessLicense: values.businessLicense,
        companyLogo: logoUrl || employer.companyLogo,
        // Giữ nguyên thông tin liên hệ
        contactName: employer.contactName,
        contactPhone: employer.contactPhone,
        contactEmail: employer.contactEmail,
        contactPosition: employer.contactPosition,
      };

      // Log để kiểm tra
      console.log("Data đã format:", updateData);

      // Kiểm tra các trường bắt buộc
      if (
        !updateData.companyName ||
        !updateData.companyAddress ||
        !updateData.taxCode
      ) {
        message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      // Kiểm tra industryId
      if (!updateData.industryId || isNaN(updateData.industryId)) {
        message.error("Vui lòng chọn ngành nghề hợp lệ");
        return;
      }

      const response = await updateEmployer(employer.id, updateData);
      console.log("Response từ server:", response);

      message.success("Cập nhật thông tin thành công");
      setIsEditing(false);

      // Refresh data
      const refreshedData = await getEmployerByEmail(employer.contactEmail);
      setEmployer(refreshedData);
      setLogoUrl(refreshedData.companyLogo);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error,
      });

      message.error(
        "Lỗi khi cập nhật thông tin: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdateContact = async (values) => {
    try {
      if (!employer) {
        message.error("Không tìm thấy thông tin công ty");
        return;
      }

      // Tìm industryId từ industryName trong danh sách industries
      const currentIndustry = industries.find(
        (ind) => ind.name === employer.industryName
      );
      if (!currentIndustry) {
        message.error("Không tìm thấy thông tin ngành nghề");
        return;
      }

      const updateData = {
        // Thông tin công ty - giữ nguyên từ employer
        companyName: employer.companyName,
        companyAddress: employer.companyAddress,
        companyPhone: employer.companyPhone,
        companyWebsite: employer.companyWebsite || null,
        companyDescription: employer.companyDescription || null,
        location: employer.location,
        companySize: employer.companySize,
        companyLogo: employer.companyLogo,
        companyImages: employer.companyImages || [],
        taxCode: employer.taxCode,
        businessLicense: employer.businessLicense,
        industryId: currentIndustry.id, // Sử dụng ID từ industry đã tìm được

        // Thông tin liên hệ mới từ form
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactPosition: values.contactPosition,
        contactEmail: employer.contactEmail, // Email không được thay đổi
      };

      console.log("Data gửi lên server:", updateData);

      const response = await updateEmployer(employer.id, updateData);

      if (response) {
        message.success("Cập nhật thông tin liên hệ thành công");
        setIsEditing(false);

        // Đảm bảo reloadPage được gọi sau khi cập nhật thành công

        reloadPage(1000);
      }
    } catch (error) {
      console.error("Error details:", error);
      message.error("Lỗi khi cập nhật thông tin: " + error.message);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setIsEditing(false);
  };

  const handleLogoUpload = async (info) => {
    if (info.file.status === "uploading") {
      setUploadLoading(true);
      return;
    }

    if (info.file.originFileObj) {
      try {
        const token = localStorage.getItem("token");
        const url = await uploadService.uploadAvatar(
          info.file.originFileObj,
          token
        );
        setLogoUrl(url);
        form.setFieldsValue({ companyLogo: url });
        message.success("Upload logo thành công");
      } catch (error) {
        message.error("Lỗi khi upload logo: " + error.message);
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const handleProvinceChange = async (value) => {
    // Reset district khi thay đổi province
    form.setFieldsValue({ district: undefined });
    setSelectedProvince(value);

    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${value}?depth=2`);
      const data = await response.json();
      const districtOptions = data.districts
        .map((district) => ({
          label: district.name,
          value: district.code,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setDistricts(districtOptions);
    } catch (error) {
      console.error('Lỗi khi tải danh sách quận/huyện:', error);
      message.error('Không thể tải danh sách quận/huyện');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="company-profile">
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className="profile-header">
              <Title level={2}>Hồ Sơ Công Ty</Title>
              {!isEditing && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {isEditing && activeTab === "1" ? (
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  name="companyName"
                  label="Tên công ty"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên công ty" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="companyPhone"
                  label="Số điện thoại công ty"
                  rules={[
                    {
                      pattern: /^\d{10,11}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Địa chỉ công ty" required>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="province"
                        label="Tỉnh/Thành phố"
                        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
                      >
                        <Select
                          placeholder="Chọn tỉnh/thành phố"
                          onChange={handleProvinceChange}
                          options={provinces}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="district"
                        label="Quận/Huyện"
                        rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
                      >
                        <Select
                          placeholder="Chọn quận/huyện"
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
              </Col>

              <Col span={12}>
                <Form.Item name="companyWebsite" label="Website công ty">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="companySize" label="Quy mô công ty">
                  <Select>
                    <Select.Option value="1-10">1-10 nhân viên</Select.Option>
                    <Select.Option value="11-50">11-50 nhân viên</Select.Option>
                    <Select.Option value="51-200">
                      51-200 nhân viên
                    </Select.Option>
                    <Select.Option value="201-500">
                      201-500 nhân viên
                    </Select.Option>
                    <Select.Option value="501-1000">
                      501-1000 nhân viên
                    </Select.Option>
                    <Select.Option value="1000+">
                      Trên 1000 nhân viên
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="taxCode"
                  label="Mã số thuế"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã số thuế" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="industryId"
                  label="Lĩnh vực công ty"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn lĩnh vực công ty",
                    },
                  ]}
                >
                  <Select>
                    {industries && industries.length > 0 ? (
                      industries.map((industry) => (
                        <Select.Option key={industry.id} value={industry.id}>
                          {industry.name}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="" disabled>
                        Đang tải danh sách ngành nghề...
                      </Select.Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="businessLicense"
                  label="Giấy phép kinh doanh"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã giấy phép kinh doanh",
                    },
                  ]}
                  tooltip="Nhập mã số giấy phép kinh doanh của công ty"
                >
                  <Input placeholder="Nhập mã giấy phép kinh doanh" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="companyDescription"
                  label="Mô tả công ty"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mô tả về công ty!',
                    },
                    {
                      min: 100,
                      message: 'Mô tả công ty cần ít nhất 100 ký tự!',
                    }
                  ]}
                >
                  <Input.TextArea
                    placeholder="Giới thiệu về công ty, văn hóa, môi trường làm việc, phúc lợi..."
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    showCount
                    maxLength={2000}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="companyLogo"
                  label="Logo công ty"
                  tooltip="Upload logo công ty (định dạng: JPG, PNG)"
                >
                  <Upload
                    name="logo"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={async ({ file, onSuccess }) => {
                      try {
                        const token = localStorage.getItem("token");
                        const url = await uploadService.uploadAvatar(
                          file,
                          token
                        );
                        setLogoUrl(url);
                        form.setFieldsValue({ companyLogo: url });
                        onSuccess();
                      } catch (error) {
                        message.error("Lỗi khi upload logo: " + error.message);
                      }
                    }}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith("image/");
                      if (!isImage) {
                        message.error("Chỉ có thể upload file ảnh!");
                        return false;
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error("Ảnh phải nhỏ hơn 2MB!");
                        return false;
                      }
                      return true;
                    }}
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="company logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div>
                        {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lưu thay đổi
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : isEditing && activeTab === "2" ? (
          <Form form={form} layout="vertical" onFinish={handleUpdateContact}>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  name="contactName"
                  label="Người liên hệ"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người liên hệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactPosition"
                  label="Chức vụ"
                  rules={[{ required: true, message: "Vui lòng nhập chức vụ" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactPhone"
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      pattern: /\d{10,11}/,
                      message: "Vui lòng nhập số điện thoại hợp lệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactEmail"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input disabled style={{ backgroundColor: "#f5f5f5" }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lưu thay đổi
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <Tabs
            defaultActiveKey="1"
            activeKey={activeTab}
            onChange={handleTabChange}
          >
            <TabPane tab="Thông tin cơ bản" key="1">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Tên công ty">
                  {employer.companyName}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {employer.companyPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Tỉnh/Thành phố">
                  {employer.location}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {employer.companyAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Website">
                  {employer.companyWebsite}
                </Descriptions.Item>
                <Descriptions.Item label="Quy mô">
                  {employer.companySize}
                </Descriptions.Item>
                <Descriptions.Item label="Mã số thuế">
                  {employer.taxCode}
                </Descriptions.Item>
                <Descriptions.Item label="Lĩnh vực">
                  {employer.industryName || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Giấy phép kinh doanh">
                  {employer.businessLicense || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Logo công ty">
                  {employer.companyLogo ? (
                    <img
                      src={employer.companyLogo}
                      alt="company logo"
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>Chưa có logo</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả công ty" span={3}>
                  {employer?.companyDescription ? (
                    <div className="company-description" style={{ 
                      whiteSpace: 'pre-line',
                      padding: '20px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      fontSize: '15px',
                      lineHeight: '1.8',
                      color: '#495057',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      margin: '10px 0'
                    }}>
                      <Typography.Paragraph
                        ellipsis={{ 
                          rows: 4,
                          expandable: true,
                          symbol: 'Xem thêm'
                        }}
                      >
                        {employer.companyDescription}
                      </Typography.Paragraph>
                    </div>
                  ) : (
                    <Empty
                      description="Chưa có mô tả về công ty"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab="Thông tin liên hệ" key="2">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Người liên hệ">
                  {employer.contactName}
                </Descriptions.Item>
                <Descriptions.Item label="Chức vụ">
                  {employer.contactPosition}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {employer.contactPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {employer.contactEmail}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab="Thống kê" key="3">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Tổng số tin tuyển dụng"
                    value={employer.totalJobs}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Tin đang tuyển"
                    value={employer.activeJobs}
                  />
                </Col>
                <Col span={8}>
                  <Card>
                    <div>
                      <div
                        style={{
                          marginBottom: "8px",
                          color: "rgba(0, 0, 0, 0.45)",
                        }}
                      >
                        Trạng thái
                      </div>
                      <StatusDisplay status={employer.status} />
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default CompanyProfile;
