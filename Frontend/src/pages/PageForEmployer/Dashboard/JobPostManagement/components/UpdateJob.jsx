import React, { useState, useEffect } from "react";
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
  Space,
  Checkbox
} from "antd";
import { updateJob, getJobById } from "../../../../../api/jobApi";
import { getEmployerByEmail } from "../../../../../api/employerApi";
import { getAllIndustries } from "../../../../../api/industryApi";
import { getAllProfessions } from "../../../../../api/professionApi";
import { getAllSkills } from "../../../../../api/skillApi";
import { getJobSkillsByJobId, updateJobSkill, createJobSkill, deleteJobSkill } from "../../../../../api/jobSkillApi";
import { MinusCircleOutlined, PlusOutlined, DollarCircleOutlined, EnvironmentOutlined, BookOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { reloadPage } from '../../../../../utils/pageUtils';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const PROVINCE_API_URL = 'https://provinces.open-api.vn/api';

const UpdateJob = ({ visible, onClose, onSuccess, jobId }) => {
  const [form] = Form.useForm();
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobSkills, setJobSkills] = useState([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employerId, setEmployerId] = useState(null);
  const [provinces, setProvinces] = useState([]);

  // Load industries và skills
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [industriesData, skillsData] = await Promise.all([
          getAllIndustries(),
          getAllSkills()
        ]);
        setIndustries(industriesData);
        setSkills(skillsData);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Load job details và job skills
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (jobId) {
          const [jobData, jobSkillsData] = await Promise.all([
            getJobById(jobId),
            getJobSkillsByJobId(jobId)
          ]);

          // Set industry và profession
          const selectedIndustry = industries.find(ind => ind.name === jobData.industryName);
          setSelectedIndustryId(selectedIndustry?.id);

          // Load professions
          const profData = await getAllProfessions();
          const filteredProfessions = profData.filter(
            profession => profession.industryName === jobData.industryName
          );
          setProfessions(filteredProfessions);

          const selectedProfession = filteredProfessions.find(
            prof => prof.name === jobData.professionName
          );

          // Format form data với job skills
          const formattedData = {
            ...jobData,
            expiryDate: dayjs(jobData.expiryDate),
            industryId: selectedIndustry?.id,
            professionId: selectedProfession?.id,
            jobSkills: jobSkillsData.map(skill => ({
              id: skill.id,
              jobId: skill.jobId,
              skillId: skill.skillId,
              skillName: skill.skillName,
              proficiencyLevel: skill.proficiencyLevel,
              description: skill.description,
              isRequired: skill.isRequired
            }))
          };

          form.setFieldsValue(formattedData);
          setJobSkills(jobSkillsData);
        }
      } catch (error) {
        message.error("Lỗi khi tải thông tin tin tuyển dụng");
      }
    };

    if (jobId && industries.length > 0) {
      fetchJobDetails();
    }
  }, [jobId, industries, form]);

  // Load employer ID
  useEffect(() => {
    const fetchEmployerId = async () => {
      try {
        const employerUser = localStorage.getItem("employer_user");
        if (!employerUser) {
          message.error("Vui lòng đăng nhập lại");
          return;
        }

        const userData = JSON.parse(employerUser);
        const employerData = await getEmployerByEmail(userData.email);
        setEmployerId(employerData?.id);
      } catch (error) {
        message.error("Lỗi khi lấy thông tin nhà tuyển dụng");
      }
    };
    fetchEmployerId();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${PROVINCE_API_URL}/p/`);
        if (!response.ok) {
          throw new Error('Không thể tải danh sách tỉnh/thành phố');
        }
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

  const handleIndustryChange = async (value) => {
    try {
      setSelectedIndustryId(value);
      form.setFieldValue('professionId', undefined); // Reset profession khi đổi industry
      
      // Load professions dựa trên industry được chọn
      const selectedIndustry = industries.find(ind => ind.id === value);
      if (selectedIndustry) {
        const profData = await getAllProfessions();
        const filteredProfessions = profData.filter(
          profession => profession.industryName === selectedIndustry.name
        );
        setProfessions(filteredProfessions);
      } else {
        setProfessions([]);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách chuyên ngành');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!employerId) {
        message.error("Không tìm thấy thông tin nhà tuyển dụng");
        return;
      }

      setLoading(true);

      // Tách job skills ra khỏi values
      const { jobSkills: skillsData, ...jobData } = values;

      // Update job info
      const formattedJobData = {
        ...jobData,
        employerId,
        expiryDate: dayjs(jobData.expiryDate).format('YYYY-MM-DD'),
      };

      await updateJob(jobId, formattedJobData);

      // Update job skills
      if (skillsData && skillsData.length > 0) {
        const updatePromises = skillsData.map(skill => {
          if (skill.id) {
            // Nếu có id thì update
            return updateJobSkill(skill.id, {
              jobId: jobId,
              skillId: skill.skillId,
              proficiencyLevel: skill.proficiencyLevel,
              description: skill.description,
              isRequired: skill.isRequired
            });
          } else {
            // Nếu không có id thì tạo mới
            return createJobSkill({
              jobId: jobId,
              skillId: skill.skillId,
              proficiencyLevel: skill.proficiencyLevel,
              description: skill.description,
              isRequired: skill.isRequired
            });
          }
        });

        await Promise.all(updatePromises);
      }

      message.success('Cập nhật tin tuyển dụng thành công');
      onClose();
      reloadPage();
      
    } catch (error) {
      console.error('Submit Error:', error);
      message.error('Lỗi khi cập nhật tin tuyển dụng: ' + 
        (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Cập nhật tin tuyển dụng
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                rules={[{ required: true, message: 'Vui lòng nhập mức lương' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  size="large"
                  prefix={<DollarCircleOutlined />}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ'}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '').replace(' VNĐ', '')}
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

          <Divider />
          <Title level={4}>Yêu cầu kỹ năng</Title>

          <Form.List name="jobSkills">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  const currentSkill = form.getFieldValue('jobSkills')[name];
                  
                  const handleDelete = () => {
                    Modal.confirm({
                      title: 'Xác nhận xóa',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Bạn có chắc chắn muốn xóa kỹ năng này không?',
                      okText: 'Xóa',
                      cancelText: 'Hủy',
                      okButtonProps: {
                        danger: true
                      },
                      async onOk() {
                        try {
                          if (currentSkill && currentSkill.id) {
                            await deleteJobSkill(currentSkill.id);
                            message.success('Xóa kỹ năng thành công');
                          }
                          remove(name);
                        } catch (error) {
                          message.error('Lỗi khi xóa kỹ năng: ' + 
                            (error.response?.data?.message || error.message));
                        }
                      },
                    });
                  };

                  return (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'skillName']}
                        rules={[{ required: true, message: 'Vui lòng chọn kỹ năng' }]}
                      >
                        <Select 
                          placeholder="Chọn kỹ năng" 
                          style={{ width: 200 }}
                          onChange={(value, option) => {
                            const skill = skills.find(s => s.skillName === value);
                            form.setFieldsValue({
                              jobSkills: form.getFieldValue('jobSkills').map((item, index) => {
                                if (index === name) {
                                  return {
                                    ...item,
                                    skillId: skill.id,
                                    skillName: skill.skillName
                                  };
                                }
                                return item;
                              })
                            });
                          }}
                        >
                          {skills.map(skill => (
                            <Option key={skill.id} value={skill.skillName}>
                              {skill.skillName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'proficiencyLevel']}
                        rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
                      >
                        <Select placeholder="Mức độ" style={{ width: 150 }}>
                          <Option value="BEGINNER">Bắt đầu</Option>
                          <Option value="INTERMEDIATE">Trung bình</Option>
                          <Option value="ADVANCED">Nâng cao</Option>
                          <Option value="EXPERT">Chuyên gia</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                      >
                        <Input placeholder="Mô tả yêu cầu" style={{ width: 200 }} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'isRequired']}
                        valuePropName="checked"
                      >
                        <Checkbox>Bắt buộc</Checkbox>
                      </Form.Item>

                      <MinusCircleOutlined 
                        onClick={handleDelete}
                        style={{ color: '#ff4d4f', fontSize: '16px', cursor: 'pointer' }}
                      />
                    </Space>
                  );
                })}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm kỹ năng
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item className="text-right">
            <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default UpdateJob;
