package com.codeforworks.NTH_WorkFinder.initializer;

import com.codeforworks.NTH_WorkFinder.model.Industry;
import com.codeforworks.NTH_WorkFinder.model.Profession;
import com.codeforworks.NTH_WorkFinder.repository.IndustryRepository;
import com.codeforworks.NTH_WorkFinder.repository.ProfessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class IndustryProfessionInitializer implements CommandLineRunner {

    @Autowired
    private IndustryRepository industryRepository;
    
    @Autowired
    private ProfessionRepository professionRepository;

    @Override
    public void run(String... args) throws Exception {
        initIndustries();
        initProfessions();
    }

    private void initIndustries() {
        if (industryRepository.count() == 0) {
            List<Industry> industries = Arrays.asList(
                createIndustry("Công nghệ thông tin và truyền thông", "IT & Telecommunications"),
                createIndustry("Tài chính và ngân hàng", "Banking & Finance"),
                createIndustry("Giáo dục và đào tạo", "Education & Training"),
                createIndustry("Bán lẻ và thương mại", "Retail & Commerce"),
                createIndustry("Sản xuất và chế tạo", "Manufacturing"),
                createIndustry("Y tế và chăm sóc sức khỏe", "Healthcare & Medical"),
                createIndustry("Bất động sản", "Real Estate"),
                createIndustry("Du lịch và khách sạn", "Tourism & Hospitality"),
                createIndustry("Logistics và vận tải", "Logistics & Transportation"),
                createIndustry("Xây dựng và kiến trúc", "Construction & Architecture")
            );
            industryRepository.saveAll(industries);
        }
    }

    private void initProfessions() {
        if (professionRepository.count() == 0) {
            Map<String, List<Profession>> professionsByIndustry = new HashMap<>();

            // IT & Telecommunications
            professionsByIndustry.put("IT & Telecommunications", Arrays.asList(
                createProfession("Phát triển ứng dụng, website và phần mềm", "Software Developer"),
                createProfession("Quản lý và điều phối các dự án phần mềm", "IT Project Manager"),
                createProfession("Quản lý hệ thống và tự động hóa", "DevOps Engineer"),
                createProfession("Bảo mật hệ thống và thông tin", "Security Engineer"),
                createProfession("Kiểm thử và đảm bảo chất lượng phần mềm", "QA Engineer"),
                createProfession("Phân tích và xử lý dữ liệu lớn", "Data Engineer"),
                createProfession("Thiết kế và phát triển UI/UX", "UI/UX Designer"),
                createProfession("Quản trị hệ thống mạng", "Network Administrator"),
                createProfession("Phân tích dữ liệu và AI", "Data Scientist"),
                createProfession("Phát triển ứng dụng di động", "Mobile Developer")
            ));

            // Banking & Finance
            professionsByIndustry.put("Banking & Finance", Arrays.asList(
                createProfession("Phân tích và tư vấn tài chính", "Financial Analyst"),
                createProfession("Quản lý tài chính doanh nghiệp", "Finance Manager"),
                createProfession("Kế toán và kiểm toán", "Accountant"),
                createProfession("Tư vấn đầu tư", "Investment Advisor"),
                createProfession("Quản lý rủi ro tài chính", "Risk Manager"),
                createProfession("Chuyên viên ngân hàng", "Banking Officer"),
                createProfession("Môi giới chứng khoán", "Stock Broker")
            ));

            // Education & Training
            professionsByIndustry.put("Education & Training", Arrays.asList(
                createProfession("Giảng dạy và đào tạo", "Teacher/Lecturer"),
                createProfession("Quản lý giáo dục", "Education Manager"),
                createProfession("Tư vấn giáo dục", "Education Consultant"),
                createProfession("Phát triển chương trình đào tạo", "Curriculum Developer"),
                createProfession("Giáo viên tiếng Anh", "English Teacher")
            ));

            // Retail & Commerce
            professionsByIndustry.put("Retail & Commerce", Arrays.asList(
                createProfession("Quản lý bán hàng", "Sales Manager"),
                createProfession("Marketing và quảng cáo", "Marketing Executive"),
                createProfession("Quản lý thương hiệu", "Brand Manager"),
                createProfession("Quản lý chuỗi cung ứng", "Supply Chain Manager"),
                createProfession("Chăm sóc khách hàng", "Customer Service")
            ));

            // Manufacturing
            professionsByIndustry.put("Manufacturing", Arrays.asList(
                createProfession("Kỹ sư sản xuất", "Production Engineer"),
                createProfession("Quản lý nhà máy", "Factory Manager"),
                createProfession("Quản lý chất lượng", "Quality Manager"),
                createProfession("Kỹ sư cơ khí", "Mechanical Engineer")
            ));

            // Healthcare & Medical
            professionsByIndustry.put("Healthcare & Medical", Arrays.asList(
                createProfession("Bác sĩ đa khoa", "General Physician"),
                createProfession("Y tá điều dưỡng", "Nurse"),
                createProfession("Dược sĩ", "Pharmacist"),
                createProfession("Chuyên viên vật lý trị liệu", "Physiotherapist"),
                createProfession("Quản lý bệnh viện", "Hospital Administrator")
            ));

            // Real Estate
            professionsByIndustry.put("Real Estate", Arrays.asList(
                createProfession("Môi giới bất động sản", "Real Estate Agent"),
                createProfession("Quản lý dự án bất động sản", "Property Project Manager"),
                createProfession("Định giá bất động sản", "Property Valuer"),
                createProfession("Tư vấn đầu tư bất động sản", "Real Estate Investment Advisor")
            ));

            // Tourism & Hospitality
            professionsByIndustry.put("Tourism & Hospitality", Arrays.asList(
                createProfession("Quản lý khách sạn", "Hotel Manager"),
                createProfession("Hướng dẫn viên du lịch", "Tour Guide"),
                createProfession("Quản lý nhà hàng", "Restaurant Manager"),
                createProfession("Điều hành tour du lịch", "Tour Operator"),
                createProfession("Lễ tân khách sạn", "Hotel Receptionist")
            ));

            // Logistics & Transportation
            professionsByIndustry.put("Logistics & Transportation", Arrays.asList(
                createProfession("Quản lý logistics", "Logistics Manager"),
                createProfession("Điều phối vận tải", "Transportation Coordinator"),
                createProfession("Quản lý kho vận", "Warehouse Manager"),
                createProfession("Chuyên viên xuất nhập khẩu", "Import/Export Specialist")
            ));

            // Construction & Architecture
            professionsByIndustry.put("Construction & Architecture", Arrays.asList(
                createProfession("Kiến trúc sư", "Architect"),
                createProfession("Kỹ sư xây dựng", "Civil Engineer"),
                createProfession("Quản lý dự án xây dựng", "Construction Project Manager"),
                createProfession("Thiết kế nội thất", "Interior Designer"),
                createProfession("Giám sát công trình", "Construction Supervisor")
            ));

            // Lưu tất cả professions
            industryRepository.findAll().forEach(industry -> {
                List<Profession> professions = professionsByIndustry.get(industry.getName());
                if (professions != null) {
                    professions.forEach(profession -> profession.setIndustry(industry));
                    professionRepository.saveAll(professions);
                }
            });
        }
    }

    private Industry createIndustry(String description, String name) {
        Industry industry = new Industry();
        industry.setName(name);
        industry.setDescription(description);
        Date now = new Date();
        industry.setCreatedDate(now);
        industry.setUpdatedDate(now);
        return industry;
    }

    private Profession createProfession(String description, String name) {
        Profession profession = new Profession();
        profession.setName(name);
        profession.setDescription(description);
        Date now = new Date();
        profession.setCreatedDate(now);
        profession.setUpdatedDate(now);
        return profession;
    }
}