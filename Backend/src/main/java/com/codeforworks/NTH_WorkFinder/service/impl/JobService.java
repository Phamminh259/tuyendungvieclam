package com.codeforworks.NTH_WorkFinder.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeforworks.NTH_WorkFinder.dto.job.JobRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.JobMapper;
import com.codeforworks.NTH_WorkFinder.model.Employer;
import com.codeforworks.NTH_WorkFinder.model.Industry;
import com.codeforworks.NTH_WorkFinder.model.Job;
import com.codeforworks.NTH_WorkFinder.model.Profession;
import com.codeforworks.NTH_WorkFinder.model.Subscription;
import com.codeforworks.NTH_WorkFinder.model.enums.EducationLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.ExperienceLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobLevel;
import com.codeforworks.NTH_WorkFinder.model.enums.JobType;
import com.codeforworks.NTH_WorkFinder.repository.ApplicationRepository;
import com.codeforworks.NTH_WorkFinder.repository.EmployerRepository;
import com.codeforworks.NTH_WorkFinder.repository.IndustryRepository;
import com.codeforworks.NTH_WorkFinder.repository.JobRepository;
import com.codeforworks.NTH_WorkFinder.repository.JobSkillRepository;
import com.codeforworks.NTH_WorkFinder.repository.ProfessionRepository;
import com.codeforworks.NTH_WorkFinder.repository.SubscriptionRepository;
import com.codeforworks.NTH_WorkFinder.service.IJobService;

@Service
@Transactional
public class JobService implements IJobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private JobSkillRepository jobSkillRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ProfessionRepository professionRepository;

    @Autowired
    private IndustryRepository industryRepository;

    @Autowired
    private JobPostingService jobPostingService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    //lấy công việc theo id
    @Override
    public JobResponseDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job"));

        // Tăng số lượt xem công việc
        job.setViewCount(job.getViewCount() + 1);

        // Kiểm tra và cập nhật trạng thái nếu đã hết hạn
        if (job.getExpiryDate() != null && job.getExpiryDate().before(new Date()) && job.isActive()) {
            job.setActive(false);
        }
        job = jobRepository.save(job);

        return JobMapper.INSTANCE.toJobResponseDTO(job);
    }

    //lấy tất cả công việc
    @Override
    public List<JobResponseDTO> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream()
                .map(JobMapper.INSTANCE::toJobResponseDTO)
                .collect(Collectors.toList());
    }

    //Lấy công việc theo id nhà tuyển dụng
    @Override
    public List<JobResponseDTO> getJobsByEmployerId(Long employerId) {
        List<Job> jobs = jobRepository.findByEmployerId(employerId);
        return jobs.stream()
                .map(JobMapper.INSTANCE::toJobResponseDTO)
                .collect(Collectors.toList());
    }

    //tạo công việc
    @Override
    public JobResponseDTO createJob(JobRequestDTO jobRequestDTO) {
        // Kiểm tra quyền đăng tin
        if (jobRequestDTO.getIsFeatured()) {
            if (!jobPostingService.canPostFeaturedJob(jobRequestDTO.getEmployerId())) {
                throw new RuntimeException("Đã hết số lượng tin nổi bật có thể đăng");
            }
        } else {
            if (!jobPostingService.canPostNormalJob(jobRequestDTO.getEmployerId())) {
                throw new RuntimeException("Đã hết số lượng tin thường có thể đăng");
            }
        }

        // Kiểm tra trạng thái của employer trước
        Employer employer = employerRepository.findById(jobRequestDTO.getEmployerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Employer"));

        if (employer.getStatus() != Employer.EmployerStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản nhà tuyển dụng chưa được kích hoạt hoặc đang bị tạm ngưng. Không thể đăng tin tuyển dụng.");
        }

        validateJobRequest(jobRequestDTO);

        Job job = JobMapper.INSTANCE.toJobEntity(jobRequestDTO);

        // Thiết lập các giá trị mặc định
        job.setApproved(false);
        job.setActive(true);
        job.setViewCount(0L);
        job.setApplicationCount(0L);
        job.setCreatedDate(new Date());
        job.setCode("JOB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        job.setFeatured(jobRequestDTO.getIsFeatured());
        job.setSubscription(getCurrentActiveSubscription(jobRequestDTO.getEmployerId()));

        job.setEmployer(employer);

        if (jobRequestDTO.getProfessionId() != null) {
            Profession profession = professionRepository.findById(jobRequestDTO.getProfessionId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Profession"));
            job.setProfession(profession);
        }

        if (jobRequestDTO.getIndustryId() != null) {
            Industry industry = industryRepository.findById(jobRequestDTO.getIndustryId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Industry"));
            job.setIndustry(industry);
        }

        Job savedJob = jobRepository.save(job);

        return JobMapper.INSTANCE.toJobResponseDTO(savedJob);
    }

    //validate dữ liệu đầu vào
    private void validateJobRequest(JobRequestDTO dto) {
        if (dto.getExpiryDate() != null && dto.getExpiryDate().before(new Date())) {
            throw new IllegalArgumentException("Ngày hết hạn phải là ngày trong tương lai");
        }

        if (dto.getSalary() != null && dto.getSalary() < 0) {
            throw new IllegalArgumentException("Lương phải lớn hơn hoặc bằng 0");
        }
    }

    // Lấy gói đăng ký active cho employer
    private Subscription getCurrentActiveSubscription(Long employerId) {
        return subscriptionRepository.findActiveSubscriptionByEmployerId(employerId)
                .orElse(null); // KHÔNG THROW LỖI
    }

    @Override
    public JobResponseDTO updateJob(Long id, JobRequestDTO jobRequestDTO) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Cập nhật các trường cơ bản
        job.setTitle(jobRequestDTO.getTitle());
        job.setDescription(jobRequestDTO.getDescription());
        job.setLocation(jobRequestDTO.getLocation());
        job.setSalary(jobRequestDTO.getSalary());
        job.setExpiryDate(jobRequestDTO.getExpiryDate());

        // Cập nhật các trường enum
        try {
            job.setRequiredJobLevel(JobLevel.valueOf(jobRequestDTO.getRequiredJobLevel()));
            job.setRequiredExperienceLevel(ExperienceLevel.valueOf(jobRequestDTO.getRequiredExperienceLevel()));
            job.setRequiredEducationLevel(EducationLevel.valueOf(jobRequestDTO.getRequiredEducationLevel()));
            job.setRequiredJobType(JobType.valueOf(jobRequestDTO.getRequiredJobType()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Giá trị không hợp lệ cho JobLevel, ExperienceLevel, EducationLevel hoặc JobType");
        }

        // Thiết lập lại mối quan hệ Employer, Profession, Industry
        Employer employer = employerRepository.findById(jobRequestDTO.getEmployerId())
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        job.setEmployer(employer);

        if (jobRequestDTO.getProfessionId() != null) {
            Profession profession = professionRepository.findById(jobRequestDTO.getProfessionId())
                    .orElseThrow(() -> new RuntimeException("Profession not found"));
            job.setProfession(profession);
        }

        if (jobRequestDTO.getIndustryId() != null) {
            Industry industry = industryRepository.findById(jobRequestDTO.getIndustryId())
                    .orElseThrow(() -> new RuntimeException("Industry not found"));
            job.setIndustry(industry);
        }

        Job updatedJob = jobRepository.save(job);
        return JobMapper.INSTANCE.toJobResponseDTO(updatedJob);
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job với id: " + id));
                
        // Xóa tất cả job_skill liên quan trước
        jobSkillRepository.deleteByJobId(id);
        
        // Xóa tất cả applications liên quan (nếu có)
        applicationRepository.deleteByJobId(id);
        
        // Sau đó mới xóa job
        jobRepository.delete(job);
    }

    // Lấy danh sách công việc có số lượt xem cao nhất
    @Override
    public List<JobResponseDTO> getTopViewedJobs(int limit) {
        return jobRepository.findTopByOrderByViewCountDesc(PageRequest.of(0, limit))
                .stream()
                .map(JobMapper.INSTANCE::toJobResponseDTO)
                .collect(Collectors.toList());
    }

    // Lấy danh sách công việc mới nhất
    @Override
    public List<JobResponseDTO> getRecentJobs(int limit) {
        return jobRepository.findByOrderByCreatedDateDesc(PageRequest.of(0, limit))
                .stream()
                .map(JobMapper.INSTANCE::toJobResponseDTO)
                .collect(Collectors.toList());
    }

    // Thêm @Scheduled để chạy task vào 00:00 mỗi ngày
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateJobStatus() {
        Date currentDate = new Date();
        List<Job> expiredJobs = jobRepository.findByExpiryDateBeforeAndIsActiveTrue(currentDate);

        for (Job job : expiredJobs) {
            job.setActive(false);
            jobRepository.save(job);
        }
    }

    // Duyệt công việc dành cho nhà tuyển dụng
    @Override
    public JobResponseDTO approveJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job"));

        job.setApproved(true);
        Job approvedJob = jobRepository.save(job);
        return JobMapper.INSTANCE.toJobResponseDTO(approvedJob);
    }

    // Từ chối công việc dành cho nhà tuyển dụng
    @Override
    public JobResponseDTO rejectJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job"));

        job.setApproved(false);
        Job rejectedJob = jobRepository.save(job);
        return JobMapper.INSTANCE.toJobResponseDTO(rejectedJob);
    }

    // Tăng số lượt ứng tuyển
    @Override
    public void incrementApplicationCount(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job"));

        // Kiểm tra và khởi tạo nếu applicationCount là null
        if (job.getApplicationCount() == null) {
            job.setApplicationCount(1L);
        } else {
            job.setApplicationCount(job.getApplicationCount() + 1);
        }

        jobRepository.save(job);
    }

}
