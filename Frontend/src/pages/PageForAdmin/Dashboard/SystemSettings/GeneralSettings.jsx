import React from "react";
import { Form, Input, Button, Select } from "antd";

const GeneralSettings = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Giá trị form:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Tên hệ thống"
        name="systemName"
        rules={[{ required: true, message: 'Vui lòng nhập tên hệ thống!' }]}
      >
        <Input placeholder="Nhập tên hệ thống" />
      </Form.Item>

      <Form.Item
        label="Email liên hệ"
        name="contactEmail"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input placeholder="admin@example.com" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GeneralSettings; 