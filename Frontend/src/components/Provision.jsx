import React from "react";
import { Modal, Typography } from "antd";
import "./../styles/Register.css";

const { Title, Paragraph, Text } = Typography;

const TermsAndConditions = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <div className="terms-title">
          <Title level={3} style={{ 
            color: '#1890ff',  // Màu xanh cho tiêu đề
            marginBottom: '10px',
            borderBottom: '2px solid #1890ff'  // Đường line màu xanh
          }}>
            Điều khoản và Điều kiện sử dụng
          </Title>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "70vh", overflow: "auto" }}
      className="terms-modal"
    >
      <Typography>
        <Paragraph>
          <Text strong>
            Vui lòng đọc kỹ các điều khoản sau đây trước khi sử dụng dịch vụ của
            TOP Việc Làm:
          </Text>
        </Paragraph>

        <Title level={4}>1. Điều khoản chung</Title>
        <Paragraph>
          1.1. Bằng việc truy cập và sử dụng TOP Việc Làm, bạn đồng ý tuân thủ và
          bị ràng buộc bởi các điều khoản và điều kiện này.
        </Paragraph>
        <Paragraph>
          1.2. TOP Việc Làm có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ
          phần nào của điều khoản này với lý do bất kỳ và vào bất cứ lúc nào.
        </Paragraph>

        <Title level={4}>2. Tài khoản người dùng</Title>
        <Paragraph>
          2.1. Bạn phải cung cấp thông tin chính xác, đầy đủ khi đăng ký tài
          khoản.
        </Paragraph>
        <Paragraph>
          2.2. Bạn có trách nhiệm bảo mật thông tin tài khoản của mình và thông
          báo ngay cho chúng tôi nếu phát hiện việc sử dụng trái phép.
        </Paragraph>
        <Paragraph>
          2.3. TOP Việc Làm có quyền từ chối cung cấp dịch vụ, đóng tài khoản hoặc
          xóa/chỉnh sửa nội dung của bạn nếu vi phạm điều khoản.
        </Paragraph>

        <Title level={4}>3. Quyền riêng tư và bảo mật</Title>
        <Paragraph>
          3.1. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính
          sách bảo mật của TOP Việc Làm.
        </Paragraph>
        <Paragraph>
          3.2. Thông tin cá nhân của bạn sẽ chỉ được sử dụng cho mục đích tìm
          kiếm việc làm và kết nối với nhà tuyển dụng.
        </Paragraph>

        <Title level={4}>4. Nội dung và hành vi</Title>
        <Paragraph>
          4.1. Bạn không được đăng tải, chia sẻ các nội dung:
          <ul>
            <li>Vi phạm pháp luật hoặc quyền của bên thứ ba</li>
            <li>Thông tin sai sự thật hoặc gây hiểu nhầm</li>
            <li>Nội dung quấy rối, xúc phạm hoặc phân biệt đối xử</li>
            <li>Virus hoặc mã độc hại</li>
          </ul>
        </Paragraph>

        <Title level={4}>5. Trách nhiệm và giới hạn trách nhiệm</Title>
        <Paragraph>
          5.1. TOP Việc Làm không đảm bảo việc sử dụng dịch vụ sẽ không bị gián
          đoạn hoặc không có lỗi.
        </Paragraph>
        <Paragraph>
          5.2. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát
          sinh từ:
          <ul>
            <li>Việc sử dụng hoặc không thể sử dụng dịch vụ</li>
            <li>Nội dung hoặc hành vi của bên thứ ba</li>
            <li>Thông tin không chính xác từ nhà tuyển dụng</li>
          </ul>
        </Paragraph>

        <Title level={4}>6. Quyền sở hữu trí tuệ</Title>
        <Paragraph>
          6.1. Tất cả nội dung trên TOP Việc Làm đều thuộc quyền sở hữu của chúng
          tôi hoặc các đối tác.
        </Paragraph>
        <Paragraph>
          6.2. Bạn không được sao chép, phân phối, hoặc khai thác thương mại bất
          kỳ phần nào của dịch vụ mà không có sự cho phép.
        </Paragraph>

        <Title level={4}>7. Chấm dứt</Title>
        <Paragraph>
          7.1. TOP Việc Làm có quyền chấm dứt hoặc đình chỉ quyền truy cập của bạn
          mà không cần thông báo trước nếu vi phạm điều khoản.
        </Paragraph>

        <Title level={4}>8. Liên hệ</Title>
        <Paragraph>
          Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ
          với chúng tôi qua:
          <ul>
            <li>Email: support@topvieclam.com</li>
            <li>Điện thoại: 1900 xxxx</li>
            <li>Địa chỉ: xxx, Thành phố Hồ Chí Minh</li>
          </ul>
        </Paragraph>
      </Typography>
    </Modal>
  );
};

export default TermsAndConditions;
