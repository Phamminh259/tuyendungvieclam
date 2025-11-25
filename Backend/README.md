## Yêu cầu trước khi chạy
- **Java**: Đã cài JDK 21 (kiểm tra bằng lệnh `java -version`).
- **Maven**: Đã cài Maven (kiểm tra bằng lệnh `mvn -version`).
- **IDE**: Nên dùng IntelliJ IDEA
- **Database**: MySQL

## HƯỚNG DẪN CHẠY SPRINGBOOT

### 1. Query lệnh sql (file workfinder.sql)

### 2.Reload file pom.xml

### 3.Cấu hình trong file .env  (có thể cấu hình cho riêng bạn hoặc dùng chính chủ)

- DATASOURCE_URL=jdbc:mysql://localhost:3306/tendbcuaban
- DATASOURCE_USER=root
- DATASOURCE_PASSWORD=your_password
- FRONTEND_URL=http://localhost:5173

- Truy cập vào: https://myaccount.google.com/
- Đăng nhập tài khoản Gmail.
- Chọn Bảo mật (Security) ở menu bên trái.
- Bật Xác minh 2 bước (2-Step Verification) nếu chưa bật.
- Sau khi bật, quay lại phần Bảo mật, kéo xuống dưới tìm mục Mật khẩu ứng dụng (App passwords).
- Chọn Loại ứng dụng là Mail, và Thiết bị là Khác, nhập ví dụ là "MyApp".
- Nhấn Tạo → Google sẽ cung cấp cho bạn một mật khẩu 16 ký tự, ví dụ: abcd efgh ijkl mnop.

- MAIL_PORT: Cổng SMTP của dịch vụ email (587 là mặc định cho Gmail).  
- MAIL_USER: Email dùng để gửi mail 
- MAIL_PASSWORD: Mật khẩu email hoặc app-specific password nếu dùng Gmail.

- Truy cap: https://console.cloud.google.com tạo OAuth client ID sẽ tự động sinh ra id
- GOOGLE_CLIENT_ID=your_google_client_id  
- GOOGLE_CLIENT_SECRET=your_google_client_secret

### ==> Chạy Ứng Dụng

## Chatbot với mô hình RAG là gì?
- Retrieval (Truy xuất): Tìm kiếm thông tin liên quan từ cơ sở dữ liệu hoặc kho tài liệu (knowledge base).
- Generation (Sinh phản hồi): Sử dụng mô hình ngôn ngữ (Language Model) để sinh ra câu trả lời tự nhiên dựa trên thông tin được truy xuất.


## Thanh toán vnpay :https://sandbox.vnpayment.vn/merchantv2/Users/Login.htm
### Truy câp link tren để nhập test thanh toán 

## Thanh toán paypal : phải đăng ký tài khoản