import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Badge, Modal, Form, TimePicker, Input, Button, message, Select, DatePicker, Timeline, Tag, InputNumber } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getInterviewsByEmployer, scheduleInterview, getInterviewsByApplication, updateInterviewByApplication } from '../../../../../api/interviewApi';
import { getAcceptedApplicationsByEmployer } from '../../../../../api/applicationApi';
import { AuthContext } from '../../../../../components/auth/AuthProvider';

const { Option } = Select;

const InterviewSchedule = () => {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);
  const [applicationInterviews, setApplicationInterviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchInterviews();
      fetchApplications();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const employerId = user?.id;
      if (!employerId) {
        message.error('Không tìm thấy thông tin nhà tuyển dụng');
        return;
      }
      const data = await getInterviewsByEmployer(employerId);
      if (data) {
        setInterviews(data);
      } else {
        setInterviews([]);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setInterviews([]); // Set empty array on error
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Lỗi khi tải lịch phỏng vấn');
      }
    }
  };

  const fetchApplications = async () => {
    try {
      const employerId = user?.id;
      if (!employerId) {
        message.error('Không tìm thấy thông tin nhà tuyển dụng');
        return;
      }
      const data = await getAcceptedApplicationsByEmployer(employerId);
      if (data) {
        console.log('Applications data:', data);
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]); // Set empty array on error
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Lỗi khi tải danh sách đơn ứng tuyển');
      }
    }
  };

  const fetchApplicationInterviews = async (applicationId) => {
    try {
      const data = await getInterviewsByApplication(applicationId);
      setApplicationInterviews(data);
    } catch (error) {
      console.error('Error fetching application interviews:', error);
      message.error('Lỗi khi tải lịch phỏng vấn');
    }
  };

  const handleApplicationChange = (value) => {
    console.log('Selected application ID:', value);
    fetchApplicationInterviews(value);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSelect = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
    form.setFieldsValue({
      interviewDate: date
    });
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (!values.applicationId) {
        message.error('Vui lòng chọn đơn ứng tuyển');
        return;
      }

      const interviewData = {
        applicationId: parseInt(values.applicationId),
        title: values.title,
        interviewDate: values.interviewDate.format('YYYY-MM-DD'),
        interviewTime: values.time.format('HH:mm:ss'),
        type: values.type,
        location: values.location,
        note: values.note || '',
        status: 'SCHEDULED'
      };

      console.log('Submitting interview data:', interviewData);
      await scheduleInterview(interviewData);
      message.success('Đã lên lịch phỏng vấn thành công');
      fetchInterviews();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Lỗi khi lên lịch phỏng vấn');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateInterview = async (values) => {
    try {
      const interviewData = {
        title: values.title,
        interviewDate: values.interviewDate.format('YYYY-MM-DD'),
        interviewTime: values.time.format('HH:mm:ss'),
        type: values.type,
        location: values.location,
        note: values.note
      };

      await updateInterviewByApplication(values.applicationId, interviewData);
      fetchInterviews(); // Refresh danh sách phỏng vấn
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  const dateCellRender = (value) => {
    const dateInterviews = interviews.filter(interview => 
      dayjs(interview.interviewDate).isSame(value, 'day')
    );

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {dateInterviews.map(interview => (
          <li key={interview.id}>
            <Badge 
              status={getStatusColor(interview.status)} 
              text={`${interview.interviewTime} - ${interview.title}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'processing';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <Calendar dateCellRender={dateCellRender} onSelect={handleSelect} />
      
      <Modal
        title="Lên lịch phỏng vấn"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="applicationId"
            label="Đơn ứng tuyển"
            rules={[{ required: true, message: 'Vui lòng chọn đơn ứng tuyển' }]}
          >
            <Select 
              placeholder="Chọn đơn ứng tuyển"
              onChange={handleApplicationChange}
            >
              {applications?.map(app => (
                <Option key={app.applications[0].id} value={app.applications[0].id}>
                  {`${app.fullName || 'Chưa có tên'} - ${app.applications[0].jobTitle || 'Chưa có vị trí'} (${app.code})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {applicationInterviews.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h4>Lịch phỏng vấn đã có:</h4>
              <Timeline>
                {applicationInterviews.map(interview => (
                  <Timeline.Item 
                    key={interview.id}
                    color={interview.status === 'COMPLETED' ? 'green' : 'blue'}
                  >
                    <div>
                      <h4>{interview.title}</h4>
                      <p>
                        <ClockCircleOutlined /> {dayjs(interview.interviewDate).format('DD/MM/YYYY')} {interview.interviewTime}
                        <br />
                        <EnvironmentOutlined /> {interview.location}
                        <br />
                        <Tag color={interview.type === 'ONLINE' ? 'blue' : 'orange'}>
                          {interview.type}
                        </Tag>
                        <Tag color={
                          interview.status === 'COMPLETED' ? 'green' : 
                          interview.status === 'CANCELLED' ? 'red' : 'blue'
                        }>
                          {interview.status}
                        </Tag>
                      </p>
                      {interview.note && <p>Ghi chú: {interview.note}</p>}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          )}

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="interviewDate"
            label="Ngày phỏng vấn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              disabledDate={disabledDate}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Hình thức"
            rules={[{ required: true, message: 'Vui lòng chọn hình thức phỏng vấn' }]}
          >
            <Select>
              <Option value="ONLINE">Trực tuyến</Option>
              <Option value="OFFLINE">Trực tiếp</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input placeholder={form.getFieldValue('type') === 'ONLINE' ? 'Nhập link meeting' : 'Nhập địa điểm phỏng vấn'} />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isSubmitting}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default InterviewSchedule; 