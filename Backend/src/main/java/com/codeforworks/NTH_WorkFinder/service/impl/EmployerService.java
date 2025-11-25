package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerStatisticsDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.TopJobDTO;
import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.EmployerMapper;
import com.codeforworks.NTH_WorkFinder.mapper.JobMapper;
import com.codeforworks.NTH_WorkFinder.mapper.SubscriptionMapper;
import com.codeforworks.NTH_WorkFinder.model.Employer;
import com.codeforworks.NTH_WorkFinder.model.Industry;
import com.codeforworks.NTH_WorkFinder.model.Job;
import com.codeforworks.NTH_WorkFinder.repository.EmployerRepository;
import com.codeforworks.NTH_WorkFinder.repository.IndustryRepository;
import com.codeforworks.NTH_WorkFinder.service.IEmployerService;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployerService implements IEmployerService {

    private final EmployerRepository employerRepository;
    private final IndustryRepository industryRepository;
    private final SubscriptionMapper subscriptionMapper;

// Xác thực quyền sở hữu của employer
//     @Autowired
//     private SecurityContextHolder securityContextHolder;

//     private void validateEmployerOwnership(Long employerId) {
//         String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
//         Employer employer = employerRepository.findById(employerId)
//                 .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));
                
//         if (!employer.getAccount().getEmail().equals(currentUserEmail)) {
//             throw new RuntimeException("Không có quyền truy cập thông tin của employer này");
//         }
//     }

    @Override
    public EmployerResponseDTO getEmployerById(Long id) {
        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));
        
        EmployerResponseDTO responseDTO = EmployerMapper.INSTANCE.toEmployerResponseDTO(employer);
        
        // Cập nhật thông tin bổ sung
        responseDTO.setTotalJobs(employer.getJobs().size());
        responseDTO.setActiveJobs((int) employer.getJobs().stream()
                .filter(Job::isActive)
                .count());
        responseDTO.setStatus(employer.getStatus().toString());
        
        return responseDTO;
    }

    // Lấy thông tin profile của NTD theo email
    @Override
    public EmployerResponseDTO getEmployerByEmail(String email) {
        Employer employer = employerRepository.findByAccountEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));
        return EmployerMapper.INSTANCE.toEmployerResponseDTO(employer);
    }

    @Override
    public List<EmployerResponseDTO> getAllEmployers() {
        List<Employer> employers = employerRepository.findAll();
        return employers.stream()
                .map(employer -> {
                    EmployerResponseDTO dto = EmployerMapper.INSTANCE.toEmployerResponseDTO(employer);
                    // Cập nhật thông tin bổ sung
                    dto.setTotalJobs(employer.getJobs().size());
                    dto.setActiveJobs((int) employer.getJobs().stream()
                            .filter(Job::isActive)
                            .count());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public EmployerResponseDTO updateEmployer(Long id, EmployerRequestDTO dto) {
        // validateEmployerOwnership(id);
        
        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));

        try {
            // Cập nhật thông tin người liên hệ (trừ email)
            employer.setContactName(dto.getContactName());
            employer.setContactPhone(dto.getContactPhone());
            employer.setContactPosition(dto.getContactPosition());

            // Cập nhật thông tin công ty
            employer.setCompanyName(dto.getCompanyName());
            employer.setCompanyPhone(dto.getCompanyPhone());
            employer.setCompanyAddress(dto.getCompanyAddress());
            employer.setCompanyWebsite(dto.getCompanyWebsite());
            employer.setCompanyDescription(dto.getCompanyDescription());
            employer.setLocation(dto.getLocation());
            employer.setCompanyLogo(dto.getCompanyLogo());
            
            // Cập nhật thông tin bổ sung
            employer.setCompanySize(dto.getCompanySize());
            employer.setTaxCode(dto.getTaxCode());
            employer.setBusinessLicense(dto.getBusinessLicense());

            // Cập nhật ngành nghề
            if (dto.getIndustryId() != null) {
                Industry industry = industryRepository.findById(dto.getIndustryId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy Industry"));
                employer.setIndustry(industry);
            }

            Employer updatedEmployer = employerRepository.save(employer);
            
            // Chuyển đổi và trả về response
            EmployerResponseDTO responseDTO = EmployerMapper.INSTANCE.toEmployerResponseDTO(updatedEmployer);
            responseDTO.setTotalJobs(updatedEmployer.getJobs().size());
            responseDTO.setActiveJobs((int) updatedEmployer.getJobs().stream()
                    .filter(Job::isActive)
                    .count());
            
            return responseDTO;
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật thông tin nhà tuyển dụng: " + e.getMessage());
        }
    }

    @Override
    public void deleteEmployer(Long id) {
        if (!employerRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy Employer");
        }
        employerRepository.deleteById(id);
    }

    // Lấy danh sách gói dịch vụ của NTD
    @Override
    public List<SubscriptionResponseDTO> getEmployerSubscriptions(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));

        return employer.getSubscriptions().stream()
                .map(subscriptionMapper::toSubscriptionResponseDTO)
                .collect(Collectors.toList());
    }

    // Tìm kiếm nhà tuyển dụng
    @Override
    public List<EmployerResponseDTO> searchEmployers(String keyword, String location, Long industryId) {
        List<Employer> employers = employerRepository.searchEmployers(keyword, location, industryId);
        return employers.stream()
                .map(employer -> {
                    EmployerResponseDTO dto = EmployerMapper.INSTANCE.toEmployerResponseDTO(employer);
                    // Cập nhật thông tin bổ sung
                    dto.setTotalJobs(employer.getJobs().size());
                    dto.setActiveJobs((int) employer.getJobs().stream()
                            .filter(Job::isActive)
                            .count());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Lấy danh sách công việc của nhà tuyển dụng
    @Override
    public List<JobResponseDTO> getEmployerJobs(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));
                
        return employer.getJobs().stream()
                .map(job -> {
                    JobResponseDTO dto = JobMapper.INSTANCE.toJobResponseDTO(job);
                    dto.setCompanyName(employer.getCompanyName());
                    dto.setCompanyLogo(employer.getCompanyLogo());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Thống kê của nhà tuyển dụng
    @Override
    public EmployerStatisticsDTO getEmployerStatistics(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));
        
        EmployerStatisticsDTO stats = new EmployerStatisticsDTO();
        
        // Thống kê cơ bản về jobs
        stats.setTotalJobs(employer.getJobs().size());
        stats.setActiveJobs((int) employer.getJobs().stream()
                .filter(Job::isActive)
                .count());
                
        // Thống kê về ứng tuyển
        int totalApplications = employer.getJobs().stream()
                .mapToInt(job -> job.getApplications().size())
                .sum();
        stats.setTotalApplications(totalApplications);
        
        // Thống kê theo tháng
        Map<String, Integer> applicationsByMonth = employer.getJobs().stream()
                .flatMap(job -> job.getApplications().stream())
                .collect(Collectors.groupingBy(
                    application -> application.getCreatedDate().toString().substring(0,7), // Format: YYYY-MM
                    Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        stats.setApplicationsByMonth(applicationsByMonth);
        
        // Thống kê theo ngành nghề
        Map<String, Integer> jobsByCategory = employer.getJobs().stream()
                .collect(Collectors.groupingBy(
                    job -> job.getProfession().getName(),
                    Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        stats.setPopularJobCategories(jobsByCategory);
        
        // Top jobs có nhiều ứng tuyển nhất
        List<TopJobDTO> topJobs = employer.getJobs().stream()
                .sorted((j1, j2) -> j2.getApplications().size() - j1.getApplications().size())
                .limit(5)
                .map(job -> {
                    return TopJobDTO.builder()
                        .jobId(job.getId())
                        .title(job.getTitle())
                        .totalApplications(job.getApplications().size())
                        .build();
                })
                .collect(Collectors.toList());
        stats.setTopPerformingJobs(topJobs);
        
        return stats;
    }

    // Xác thực tài khoản nhà tuyển dụng
    @Transactional
    public Employer approveEmployer(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));
                
        employer.setStatus(Employer.EmployerStatus.ACTIVE);
        return employerRepository.save(employer);
    }

    // Tạm ngưng tài khoản nhà tuyển dụng
    @Transactional
    public Employer suspendEmployer(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));
        employer.setStatus(Employer.EmployerStatus.SUSPENDED);
        return employerRepository.save(employer);
    }
}
