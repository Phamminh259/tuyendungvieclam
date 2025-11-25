import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

const OverviewSection = ({ profile }) => {
  return (
    <div className="overview-section">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Lượt xem hồ sơ" 
              value={0} 
              suffix="lượt"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Nhà tuyển dụng đã lưu" 
              value={0} 
              suffix="lượt"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Việc làm đã ứng tuyển" 
              value={0} 
              suffix="việc"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewSection;
