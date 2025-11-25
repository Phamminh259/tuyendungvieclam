import React from 'react';
import { List, Card, Button } from 'antd';

const NotificationsSection = () => {
  return (
    <div className="notifications-section">
      <Card title="Thông Báo">
        <List
          dataSource={[]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title="Chưa có thông báo nào"
                description="Bạn chưa có thông báo mới"
              />
            </List.Item>
          )}
          locale={{
            emptyText: 'Không có thông báo'
          }}
        />
      </Card>
    </div>
  );
};

export default NotificationsSection;
