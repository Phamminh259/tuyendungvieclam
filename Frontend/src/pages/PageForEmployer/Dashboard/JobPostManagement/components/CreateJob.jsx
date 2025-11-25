import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button, 
  message, 
  Modal,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  Switch,
  Statistic
} from 'antd';
import { 
  DollarCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BankOutlined,
  UserOutlined,
  BookOutlined,
  PushpinOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import { createJob, getJobLimits } from '../../../../../api/jobApi';
import { getAllIndustries } from '../../../../../api/industryApi';
import { getAllProfessions } from '../../../../../api/professionApi';
import { getEmployerByEmail } from "../../../../../api/employerApi";
import JobSkillForm from './JobSkillForm';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const PROVINCE_API_URL = 'https://provinces.open-api.vn/api';

const CreateJob = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdJobId, setCreatedJobId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [jobLimits, setJobLimits] = useState({
    normalJobRemaining: 0,
    featuredJobRemaining: 0
  });

  useEffect(() => {
    const fetchJobLimits = async () => {
      try {
        const employerUser = JSON.parse(localStorage.getItem("employer_user"));
        if (employerUser) {
          const limits = await getJobLimits(employerUser.id);
          setJobLimits(limits);
        }
      } catch (error) {
        console.error('Error fetching job limits:', error);
      }
    };
    fetchJobLimits();
  }, []);

  // Load danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${PROVINCE_API_URL}/p/`);
        const data = await response.json();
        const formattedData = data.map(province => ({
          id: province.code,
          name: province.name,
          code: province.code
        }));
        setProvinces(formattedData);
      } catch (error) {
        message.error('Lỗi khi tải danh sách tỉnh/thành phố');
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await getAllIndustries();
        setIndustries(data);
      } catch (error) {
        message.error('Lỗi khi tải danh sách ngành nghề');
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchProfessions = async () => {
      if (!selectedIndustryId) {
        setProfessions([]);
        return;
      }
      try {
        const data = await getAllProfessions();
        const selectedIndustry = industries.find(ind => ind.id === selectedIndustryId);
        
        const filteredProfessions = data.filter(
          profession => profession.industryName === selectedIndustry?.name
        );
        setProfessions(filteredProfessions);
      } catch (error) {
        console.error('Error fetching professions:', error);
        message.error('Lỗi khi tải danh sách chuyên ngành');
      }
    };
    fetchProfessions();
  }, [selectedIndustryId, industries]);

  const handleIndustryChange = (value) => {
    console.log('Selected Industry ID changed to:', value);
    setSelectedIndustryId(value);
    form.setFieldValue('professionId', undefined);
  };

  const handlePinChange = (checked) => {
    if (checked && jobLimits.featuredJobRemaining <= 0) {
      message.error('Bạn đã hết lượt ghim tin tuyển dụng');
      return;
    }
    setIsPinned(checked);
    form.setFieldValue('isPinned', checked);
  };

  const handleSubmit = async (values) => {
    if (jobLimits.normalJobRemaining <= 0) {
      message.error('Bạn đã hết lượt đăng tin tuyển dụng');
      return;
    }

    try {
      setLoading(true);
      const employerUser = localStorage.getItem("employer_user");
      if (!employerUser) {
        message.error("Vui lòng đăng nhập lại");
        return;
      }

      const userData = JSON.parse(employerUser);
      const employerData = await getEmployerByEmail(userData.email);
      
      if (!employerData?.id) {
        message.error("Không tìm thấy thông tin nhà tuyển dụng");
        return;
      }

      const formattedValues = {
        ...values,
        expiryDate: dayjs(values.expiryDate).format('YYYY-MM-DD'),
        employerId: employerData.id,
        isFeatured: values.isPinned || false
      };

      const response = await createJob(formattedValues);
      message.success('Tạo tin tuyển dụng thành công');
      setCreatedJobId(response.id);
      setCurrentStep(1);
      
      // Cập nhật lại job limits
      const newLimits = await getJobLimits(employerData.id);
      setJobLimits(newLimits);
    } catch (error) {
      console.error('Error details:', error);
      message.error('Lỗi khi tạo tin tuyển dụng: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi thêm thành công
  const handleSkillsSuccess = () => {
    form.resetFields();
    setCreatedJobId(null);
    setCurrentStep(0);
    onSuccess?.();
    onClose();
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  };

  const parseCurrency = (value) => {
    return value.replace(/\$\s?|(,*)/g, '').replace(' VNĐ', '');
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Tạo tin tuyển dụng mới
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <Card title="Số lượt còn lại" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Đăng tin tuyển dụng"
              value={jobLimits.normalJobRemaining}
              prefix={<FileAddOutlined />}
              valueStyle={{ 
                color: jobLimits.normalJobRemaining > 0 ? '#3f8600' : '#cf1322'
              }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Ghim tin tuyển dụng"
              value={jobLimits.featuredJobRemaining}
              prefix={<PushpinOutlined />}
              valueStyle={{ 
                color: jobLimits.featuredJobRemaining > 0 ? '#3f8600' : '#cf1322'
              }}
            />
          </Col>
        </Row>
      </Card>

      {currentStep === 0 ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
          initialValues={{
            isPinned: false,
          }}
        >
          <Card bordered={false}>
            <Title level={4}>Thông tin cơ bản</Title>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                  <Input 
                    prefix={<BookOutlined />}
                    placeholder="VD: Tuyển Senior React Developer" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Mô tả công việc"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                  <TextArea 
                    rows={6} 
                    placeholder="Mô tả chi tiết về công việc, yêu cầu và quyền lợi..." 
                    showCount
                    maxLength={2000}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <Title level={4}>Yêu cầu công việc</Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Địa điểm làm việc"
                  rules={[{ required: true, message: 'Vui lòng chọn địa điểm' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn tỉnh/thành phố"
                    size="large"
                    prefix={<EnvironmentOutlined />}
                    optionFilterProp="children"
                  >
                    {provinces.map(province => (
                      <Option key={province.code} value={province.name}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="salary"
                  label="Mức lương"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mức lương' },
                    { 
                      pattern: /^[0-9,]*$/,
                      message: 'Chỉ được nhập số'
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    prefix={<DollarCircleOutlined />}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                    min={0}
                    step={1000000}
                    placeholder="VD: 15,000,000"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="requiredJobType"
                  label="Loại công việc"
                  rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
                >
                  <Select size="large" placeholder="Chọn loại công việc">
                    <Option value="FULL_TIME">Toàn thời gian</Option>
                    <Option value="PART_TIME">Bán thời gian</Option>
                    <Option value="SEASONAL">Thời vụ</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="expiryDate"
                  label="Ngày hết hạn"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    size="large"
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày hết hạn"
                    disabledDate={(current) => {
                      return current && current < dayjs().endOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <Title level={4}>Yêu cầu ứng viên</Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="requiredJobLevel"
                  label="Cấp bậc"
                  rules={[{ required: true, message: 'Vui lòng chọn cấp bậc' }]}
                >
                  <Select size="large" placeholder="Chọn cấp bậc">
                    <Option value="INTERN">Thực tập sinh</Option>
                    <Option value="FRESHER">Fresher</Option>
                    <Option value="JUNIOR">Junior</Option>
                    <Option value="MIDDLE">Middle</Option>
                    <Option value="SENIOR">Senior</Option>
                    <Option value="LEAD">Lead</Option>
                    <Option value="MANAGER">Manager</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="requiredExperienceLevel"
                  label="Kinh nghiệm"
                  rules={[{ required: true, message: 'Vui lòng chọn yêu cầu kinh nghiệm' }]}
                >
                  <Select size="large" placeholder="Chọn yêu cầu kinh nghiệm">
                    <Option value="NO_EXPERIENCE">Không yêu cầu kinh nghiệm</Option>
                    <Option value="LESS_THAN_1_YEAR">Dưới 1 năm</Option>
                    <Option value="ONE_TO_THREE_YEARS">1-3 năm</Option>
                    <Option value="THREE_TO_FIVE_YEARS">3-5 năm</Option>
                    <Option value="FIVE_TO_TEN_YEARS">5-10 năm</Option>
                    <Option value="MORE_THAN_TEN_YEARS">Trên 10 năm</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="requiredEducationLevel"
                  label="Trình độ học vấn"
                  rules={[{ required: true, message: 'Vui lòng chọn trình độ học vấn' }]}
                >
                  <Select size="large" placeholder="Chọn trình độ học vấn">
                    <Option value="HIGH_SCHOOL">Tốt nghiệp THPT</Option>
                    <Option value="COLLEGE">Cao đẳng</Option>
                    <Option value="UNIVERSITY">Đại học</Option>
                    <Option value="POSTGRADUATE">Thạc sĩ</Option>
                    <Option value="DOCTORATE">Tiến sĩ</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="industryId"
                  label="Ngành nghề"
                  rules={[{ required: true, message: 'Vui lòng chọn ngành nghề' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn ngành nghề"
                    onChange={handleIndustryChange}
                    loading={!industries.length}
                    size="large"
                    optionFilterProp="children"
                  >
                    {industries.map(industry => (
                      <Option key={industry.id} value={industry.id}>
                        {industry.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="professionId"
                  label="Chuyên ngành"
                  rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành' }]}
                >
                  <Select
                    showSearch
                    placeholder={selectedIndustryId ? "Chọn chuyên ngành" : "Vui lòng chọn ngành nghề trước"}
                    disabled={!selectedIndustryId}
                    loading={selectedIndustryId && !professions.length}
                    size="large"
                    optionFilterProp="children"
                  >
                    {professions.map(profession => (
                      <Option key={profession.id} value={profession.id}>
                        {profession.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span>
                  <PushpinOutlined /> Ghim tin tuyển dụng
                </span>
              }
              name="isPinned"
              valuePropName="checked"
              tooltip="Tin tuyển dụng được ghim sẽ xuất hiện ở vị trí nổi bật"
            >
              <Switch
                checkedChildren="Bật"
                unCheckedChildren="Tắt"
                checked={isPinned}
                onChange={handlePinChange}
                disabled={jobLimits.featuredJobRemaining <= 0}
              />
            </Form.Item>

            <Form.Item className="text-right">
              <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tiếp tục
              </Button>
            </Form.Item>
          </Card>
        </Form>
      ) : (
        <JobSkillForm jobId={createdJobId} onSuccess={handleSkillsSuccess} />
      )}
    </Modal>
  );
};

export default CreateJob;