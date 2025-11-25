import { message } from 'antd';

export const handleError = (error, defaultMessage = 'Đã có lỗi xảy ra') => {
  console.error('API Error:', error);

  // Kiểm tra nếu có response từ server
  if (error.response) {
    const { status, data } = error.response;

    // Xử lý các mã lỗi HTTP phổ biến
    switch (status) {
      case 400:
        message.error(data.message || 'Yêu cầu không hợp lệ');
        break;
      case 401:
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        break;
      case 403:
        message.error('Bạn không có quyền thực hiện thao tác này');
        break;
      case 404:
        message.error(data.message || 'Không tìm thấy dữ liệu');
        break;
      case 500:
        message.error('Lỗi hệ thống. Vui lòng thử lại sau');
        break;
      default:
        message.error(data.message || defaultMessage);
    }
  } else if (error.request) {
    // Yêu cầu được gửi nhưng không nhận được response
    message.error('Không thể kết nối đến máy chủ');
  } else {
    // Có lỗi khi thiết lập request
    message.error(defaultMessage);
  }

  throw error; // Ném lỗi để component có thể xử lý thêm nếu cần
}; 