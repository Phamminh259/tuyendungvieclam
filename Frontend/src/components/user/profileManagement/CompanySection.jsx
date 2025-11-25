import React from 'react';
import { Card, List, Button } from 'antd';

const CompanySection = () => {
  return (
    <div className="company-section">
      <Card title="Công ty đã theo dõi">
        <List
          dataSource={[]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title="Chưa có công ty nào"
                description="Bạn chưa theo dõi công ty nào"
              />
            </List.Item>
          )}
          locale={{
            emptyText: 'Chưa có công ty nào được theo dõi'
          }}
        />
      </Card>
    </div>
  );
};

export default CompanySection;
