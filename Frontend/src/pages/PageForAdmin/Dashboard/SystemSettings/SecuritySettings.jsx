import React from "react";
import { Form, Input, Button, Switch } from "antd";

const SecuritySettings = () => {
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
        label="Bật xác thực hai lớp"
        name="twoFactorAuth"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Thời gian hết hạn phiên đăng nhập (phút)"
        name="sessionTimeout"
        rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
      >
        <Input type="number" min={1} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SecuritySettings; 