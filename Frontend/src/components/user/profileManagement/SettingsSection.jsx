import React from 'react';
import { Card, Form, Input, Button, Divider, Switch } from 'antd';

const SettingsSection = () => {
  return (
    <div className="settings-section">
      <Card title="Cài Đặt Tài Khoản">
        <Form layout="vertical">
          <h3>Thông tin đăng nhập</h3>
          <Form.Item label="Email">
            <Input disabled value="user@example.com" />
          </Form.Item>
          
          <Form.Item label="Mật khẩu">
            <Button type="primary">Đổi mật khẩu</Button>
          </Form.Item>

          <Divider />

          <h3>Cài đặt thông báo</h3>
          <Form.Item label="Nhận thông báo qua email">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item label="Nhận thông báo việc làm mới">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item label="Nhận thông báo từ nhà tuyển dụng">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsSection; 