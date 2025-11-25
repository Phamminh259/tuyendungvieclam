package com.codeforworks.NTH_WorkFinder.security.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.List;
import java.text.SimpleDateFormat;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.codeforworks.NTH_WorkFinder.config.AppConfig;
import com.codeforworks.NTH_WorkFinder.model.Application;
import com.codeforworks.NTH_WorkFinder.model.Interview;
import com.codeforworks.NTH_WorkFinder.model.Job;

@Service
@RequiredArgsConstructor
public class EmailService {

    
    private final JavaMailSender mailSender;

    private final AppConfig appConfig;
    

    // Gửi mã xác nhận đăng ký
    public void sendVerificationCode(String toEmail, String code) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

        String htmlMsg = "<html><body>" +
                "<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;'>" +
                "<h2 style='color: #4CAF50;'>Xác nhận đăng ký tài khoản</h2>" +
                "<p>Chào bạn,</p>" +
                "<p>Cảm ơn bạn đã đăng ký tài khoản trên nền tảng của chúng tôi. Vui lòng nhập mã xác nhận sau đây để hoàn tất đăng ký:</p>" +
                "<h3 style='background: #f0f0f0; padding: 10px; display: inline-block; border-radius: 5px;'>" + code + "</h3>" +
                "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>" +
                "</div></body></html>";

        helper.setTo(toEmail);
        helper.setSubject("Xác nhận đăng ký tài khoản");
        helper.setText(htmlMsg, true);
        mailSender.send(message);
    }

    // Gửi email thông báo đăng ký thành công
    public void sendRegistrationSuccessEmail(String toEmail, String accountEmail) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

        String htmlMsg = "<html><body>" +
                "<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;'>" +
                "<h2 style='color: #4CAF50;'>Đăng ký thành công</h2>" +
                "<p>Chào bạn,</p>" +
                "<p>Bạn đã đăng ký thành công tài khoản với thông tin sau:</p>" +
                "<p><strong>Email đăng nhập:</strong> " + accountEmail + "</p>" +
                "<p>Vui lòng giữ thông tin đăng nhập an toàn.</p>" +
                "<p>Cảm ơn bạn đã chọn sử dụng nền tảng của chúng tôi!</p>" +
                "<div style='padding: 10px 0; font-size: 12px; color: #777;'>Đây là email tự động, vui lòng không trả lời.</div>" +
                "</div></body></html>";

        helper.setTo(toEmail);
        helper.setSubject("Chúc mừng! Đăng ký tài khoản thành công");
        helper.setText(htmlMsg, true);
        mailSender.send(message);
    }

    // Gửi email yêu cầu thay đổi mật khẩu
    public void sendPasswordResetEmail(String email, String resetCode) throws MessagingException {
        // Tạo đối tượng MimeMessage
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Đặt thông tin cho email
        helper.setTo(email);
        helper.setSubject("Yêu cầu thay đổi mật khẩu");
        helper.setText(buildEmailContent(resetCode), true); // true để cho phép email ở dạng HTML

        // Gửi email
        mailSender.send(message);
    }

    private String buildEmailContent(String resetCode) {
        return "<html>"
                + "<body style=\"font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;\">"
                + "<div style=\"background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;\">"
                + "<h2 style=\"color: #333333; text-align: center;\">Yêu cầu thay đổi mật khẩu</h2>"
                + "<p style=\"font-size: 16px; color: #555555;\">Chào bạn,</p>"
                + "<p style=\"font-size: 16px; color: #555555;\">Đây là mã xác minh để giúp bạn thay đổi mật khẩu:</p>"
                + "<h3 style=\"background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 24px; border-radius: 5px; color: #333333;\">"
                + resetCode
                + "</h3>"
                + "<p style=\"font-size: 16px; color: #555555;\">Mã xác minh này sẽ hết hạn sau 5 phút.</p>"
                + "<p style=\"font-size: 16px; color: #555555;\">Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>"
                + "<p style=\"font-size: 14px; color: #888888; text-align: center;\">Cảm ơn bạn,</p>"
                + "<p style=\"font-size: 14px; color: #888888; text-align: center;\">Đội ngũ hỗ trợ</p>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    // Gửi email gợi ý việc làm phù hợp
    public void sendJobSuggestions(String toEmail, List<Job> jobs) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        String frontendUrl = appConfig.getFrontendUrl();
        
        StringBuilder htmlMsg = new StringBuilder();
        htmlMsg.append("<html><body style='font-family: Arial, sans-serif; color: #333;'>");
        htmlMsg.append("<div style='max-width: 600px; margin: auto; padding: 20px;'>");
        htmlMsg.append("<h2 style='color: #2196F3; text-align: center;'>Gợi ý Việc Làm Phù Hợp Với Bạn</h2>");
        htmlMsg.append("<p style='color: #666;'>Chào bạn,</p>");
        htmlMsg.append("<p style='color: #666;'>Chúng tôi đã tìm thấy một số việc làm có thể phù hợp với bạn:</p>");

        for (Job job : jobs) {
            htmlMsg.append("<div style='background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;'>");
            
            // Thêm logo công ty
            String logoUrl = job.getEmployer().getCompanyLogo();
            if (logoUrl != null && !logoUrl.isEmpty()) {
                htmlMsg.append("<div style='text-align: center; margin-bottom: 10px;'>")
                      .append("<img src='").append(logoUrl).append("' ")
                      .append("style='max-width: 150px; max-height: 80px; object-fit: contain;' />")
                      .append("</div>");
            }
            
            htmlMsg.append("<h3 style='color: #1976D2; margin: 0 0 10px 0;'>").append(job.getTitle()).append("</h3>");
            htmlMsg.append("<p style='margin: 5px 0;'><strong>Công ty:</strong> ").append(job.getEmployer().getCompanyName()).append("</p>");
            htmlMsg.append("<p style='margin: 5px 0;'><strong>Địa điểm:</strong> ").append(job.getLocation()).append("</p>");
            htmlMsg.append("<p style='margin: 5px 0;'><strong>Mức lương:</strong> ").append(formatSalary(job.getSalary())).append("</p>");
            htmlMsg.append("<p style='margin: 5px 0;'><strong>Loại công việc:</strong> ").append(job.getRequiredJobType()).append("</p>");
            htmlMsg.append("<p style='margin: 5px 0;'><strong>Kinh nghiệm:</strong> ").append(job.getRequiredExperienceLevel()).append("</p>");
            htmlMsg.append("<a href='").append(frontendUrl).append("/jobDetail/").append(job.getId()).append("' ")
                   .append("style='display: inline-block; background: #2196F3; color: white; padding: 10px 20px; ")
                   .append("text-decoration: none; border-radius: 5px; margin-top: 10px;'>")
                   .append("Xem Chi Tiết</a>");
            htmlMsg.append("</div>");
        }

        htmlMsg.append("<p style='color: #666; margin-top: 20px;'>Chúc bạn tìm được công việc phù hợp!</p>");
        htmlMsg.append("<p style='color: #999; font-size: 12px; margin-top: 30px;'>Email này được gửi tự động, vui lòng không trả lời.</p>");
        htmlMsg.append("</div></body></html>");

        helper.setTo(toEmail);
        helper.setSubject("Gợi ý Việc Làm Phù Hợp Với Bạn");
        helper.setText(htmlMsg.toString(), true);
        mailSender.send(message);
    }
    private String formatSalary(Long salary) {
        if (salary == null) return "Thương lượng";
        return formatNumber(salary.doubleValue()) + " VNĐ";
    }
    private String formatNumber(Double number) {
        if (number >= 1000000) {
            return String.format("%.1f triệu", number / 1000000);
        }
        return String.format("%,.0f", number);
    }

    // Gửi email thông báo hết hạn subscription
    public void sendSubscriptionExpiredNotification(String toEmail, String packageName, Date expiryDate) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        
        String htmlMsg = String.format("""
            <div style='font-family: Arial, sans-serif;'>
                <h2>Thông Báo Hết Hạn Gói Dịch Vụ</h2>
                <p>Gói dịch vụ %s của bạn đã hết hạn vào ngày %s</p>
                <p>Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.</p>
            </div>
            """, packageName, new SimpleDateFormat("dd/MM/yyyy").format(expiryDate));
        
        helper.setTo(toEmail);
        helper.setSubject("Thông Báo Hết Hạn Gói Dịch Vụ");
        helper.setText(htmlMsg, true);
        mailSender.send(message);
    }

    // gửi email thông báo tin nhắn mới
    public void sendFirstMessageNotification(String toEmail, String companyName, String message) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        String frontendUrl = appConfig.getFrontendUrl();
        String htmlMsg = String.format("""
            <html><body>
            <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;'>
                <h2 style='color: #4CAF50;'>Tin nhắn mới từ nhà tuyển dụng</h2>
                <p>Chào bạn,</p>
                <p>Bạn vừa nhận được tin nhắn từ công ty <strong>%s</strong>:</p>
                <div style='background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;'>
                    <p style='margin: 0;'>"%s"</p>
                </div>
                <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết và phản hồi.</p>
                <a href='%s' 
                   style='display: inline-block; background: #4CAF50; color: white; 
                          padding: 10px 20px; text-decoration: none; border-radius: 5px; 
                          margin-top: 15px;'>
                    Xem tin nhắn
                </a>
            </div>
            </body></html>
            """, companyName, message, frontendUrl);

        helper.setTo(toEmail);
        helper.setSubject("Tin nhắn mới từ " + companyName);
        helper.setText(htmlMsg, true);
        mailSender.send(mimeMessage);
    }

    // gửi email thông báo lịch phỏng vấn
     public void sendInterviewInvitation(Interview interview) {
        Application application = interview.getApplication();
        String candidateEmail = application.getCandidate().getUser().getAccount().getEmail();
        String candidateName = application.getCandidate().getUser().getFullName();
        String jobTitle = application.getJob().getTitle();
        String companyName = application.getJob().getEmployer().getCompanyName();

        String emailContent = String.format("""
            Xin chào %s,
            
            Bạn có lịch phỏng vấn mới cho vị trí %s tại công ty %s
            
            Chi tiết buổi phỏng vấn:
            - Thời gian: %s %s
            - Hình thức: %s
            - Địa điểm: %s
            - Ghi chú: %s
            
            Vui lòng chuẩn bị đầy đủ và đúng giờ.
            
            Trân trọng,
            %s
            """,
            candidateName,
            jobTitle,
            companyName,
            interview.getInterviewDate(),
            interview.getInterviewTime(),
            interview.getType(),
            interview.getLocation(),
            interview.getNote(),
            companyName
        );

        sendEmail(
            candidateEmail,
            "Thông báo lịch phỏng vấn - " + jobTitle,
            emailContent
        );
    }

    private void sendEmail(String toEmail, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
}
