package com.codeforworks.NTH_WorkFinder.initializer;

import com.codeforworks.NTH_WorkFinder.model.Skill;
import com.codeforworks.NTH_WorkFinder.repository.SkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(2)
public class SkillInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SkillInitializer.class);

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public void run(String... args) throws Exception {
        if (skillRepository.count() == 0) {
            List<String> skillNames = Arrays.asList(
                // Kỹ năng mềm
                "Giao tiếp", 
                "Làm việc nhóm",
                "Quản lý thời gian",
                "Giải quyết vấn đề",
                "Tư duy phản biện",
                "Thuyết trình",
                "Đàm phán",
                "Lãnh đạo",
                "Quản lý dự án",
                "Tổ chức sự kiện",
                "Tư duy sáng tạo",
                "Khả năng thích nghi",
                "Quản lý stress",

                // Kỹ năng ngôn ngữ
                "Tiếng Anh giao tiếp",
                "Tiếng Anh thương mại",
                "Tiếng Anh IELTS",
                "Tiếng Anh TOEIC",
                "Tiếng Nhật N1",
                "Tiếng Nhật N2",
                "Tiếng Nhật N3",
                "Tiếng Hàn TOPIK 3",
                "Tiếng Hàn TOPIK 4",
                "Tiếng Hàn TOPIK 5",
                "Tiếng Trung HSK 4",
                "Tiếng Trung HSK 5",
                "Tiếng Trung HSK 6",

                // Kỹ năng công nghệ
                "Microsoft Office",
                "Microsoft Excel",
                "Microsoft PowerPoint",
                "Microsoft Word",
                "Adobe Photoshop",
                "Adobe Illustrator",
                "Adobe XD",
                "Figma",
                "HTML/CSS",
                "JavaScript",
                "TypeScript",
                "React.js",
                "Vue.js",
                "Angular",
                "Node.js",
                "Express.js",
                "Python",
                "Django",
                "Flask",
                "Java",
                "Spring Boot",
                "C#",
                ".NET",
                "PHP",
                "Laravel",
                "SQL",
                "MySQL",
                "PostgreSQL",
                "MongoDB",
                "Redis",
                "Git",
                "Docker",
                "Kubernetes",
                "AWS",
                "Google Cloud",
                "Azure",
                "Linux",
                "Machine Learning",
                "Deep Learning",
                "Data Science",
                "Big Data",
                "Blockchain",

                // Kỹ năng kinh doanh/marketing
                "Digital Marketing",
                "Social Media Marketing",
                "Content Marketing",
                "Copywriting",
                "SEO/SEM",
                "Google Analytics",
                "Facebook Ads",
                "Google Ads",
                "TikTok Ads",
                "Email Marketing",
                "Influencer Marketing",
                "Brand Management",
                "Market Research",
                "Customer Relationship Management",
                "Sales B2B",
                "Sales B2C",
                "Customer Service",
                "Business Development",
                "Business Strategy",
                "Business Analysis",

                // Kỹ năng tài chính/kế toán
                "Kế toán tổng hợp",
                "Kế toán quản trị",
                "Phân tích tài chính",
                "Lập báo cáo tài chính",
                "Kiểm toán",
                "Thuế",
                "Ngân hàng",
                "Đầu tư",
                "Quản lý danh mục đầu tư",
                "Phân tích đầu tư",
                "Quản lý rủi ro tài chính",
                "Mô hình tài chính",
                "Định giá doanh nghiệp",
                "Kế hoạch tài chính",

                // Kỹ năng thiết kế
                "UI/UX Design",
                "Graphic Design",
                "Web Design",
                "Mobile App Design",
                "Motion Graphics",
                "3D Modeling",
                "Video Editing",
                "Animation",
                "Logo Design",
                "Brand Identity Design",
                "Package Design",
                "Editorial Design",
                "Typography",
                "Color Theory",

                // Kỹ năng quản lý
                "Quản lý nhân sự",
                "Tuyển dụng",
                "Đào tạo nhân viên",
                "Quản lý vận hành",
                "Quản lý chuỗi cung ứng",
                "Quản lý chất lượng",
                "Quản lý sản xuất",
                "Quản lý kho",
                "Quản lý rủi ro",
                "Quản lý chi phí",
                "Quản lý hiệu suất",
                "Quản lý thay đổi",
                "Quản lý khủng hoảng",

                // Kỹ năng chuyên ngành
                "Nghiên cứu khoa học",
                "Phân tích dữ liệu",
                "Viết báo cáo",
                "Biên phiên dịch",
                "Tư vấn pháp luật",
                "Y tế - Chăm sóc sức khỏe",
                "Kiến trúc - Xây dựng",
                "Logistics",
                "An toàn lao động",
                "Bảo vệ môi trường",
                "Tư vấn tâm lý",
                "Giáo dục đào tạo",
                "Nghiên cứu thị trường",
                "Phát triển sản phẩm",

                // Chứng chỉ chuyên môn
                "Chứng chỉ PMP",
                "Chứng chỉ IELTS",
                "Chứng chỉ TOEIC",
                "Chứng chỉ CFA",
                "Chứng chỉ ACCA",
                "Chứng chỉ AWS",
                "Chứng chỉ Cisco",
                "Chứng chỉ Google Analytics",
                "Chứng chỉ Digital Marketing",
                "Chứng chỉ Project Management",
                "Chứng chỉ Agile Scrum",
                "Chứng chỉ Six Sigma",
                "Chứng chỉ ISO"
            );

            int successCount = 0;
            int skipCount = 0;

            for (String skillName : skillNames) {
                try {
                    if (!skillRepository.existsBySkillName(skillName)) {
                        Skill skill = new Skill();
                        skill.setSkillName(skillName);
                        skillRepository.save(skill);
                        successCount++;
                    } else {
                        skipCount++;
                    }
                } catch (Exception e) {
                    logger.error("Error initializing skill: " + skillName, e);
                }
            }

            logger.info(">>> INITIALIZED SKILLS DATA - Success: {}, Skipped: {}", 
                successCount, skipCount);
        } else {
            logger.info(">>> SKILLS DATA ALREADY EXISTS - Count: {}", 
                skillRepository.count());
        }
    }
}