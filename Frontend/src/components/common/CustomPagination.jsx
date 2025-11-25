import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({ 
  total, 
  pageSize = 10,
  current,
  onChange,
  showTotal = (total) => `Tổng số ${total} mục`,
  showSizeChanger = true,
  showQuickJumper = true,
  ...rest 
}) => {
  return (
    <Pagination
      total={total}
      pageSize={pageSize}
      current={current}
      onChange={onChange}
      showTotal={showTotal}
      showSizeChanger={showSizeChanger}
      showQuickJumper={showQuickJumper}
      {...rest}
    />
  );
};

export default CustomPagination; 