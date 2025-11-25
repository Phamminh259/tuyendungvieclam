package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.WorkHistoryDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.CandidateMapper;
import com.codeforworks.NTH_WorkFinder.mapper.JobMapper;
import com.codeforworks.NTH_WorkFinder.model.Candidate;
import com.codeforworks.NTH_WorkFinder.model.CandidateSkill;
import com.codeforworks.NTH_WorkFinder.model.Industry;
import com.codeforworks.NTH_WorkFinder.model.Job;
import com.codeforworks.NTH_WorkFinder.model.JobSkill;
import com.codeforworks.NTH_WorkFinder.model.Profession;
import com.codeforworks.NTH_WorkFinder.model.WorkHistory;
import com.codeforworks.NTH_WorkFinder.model.enums.JobLevel;
import com.codeforworks.NTH_WorkFinder.repository.CandidateRepository;
import com.codeforworks.NTH_WorkFinder.repository.IndustryRepository;
import com.codeforworks.NTH_WorkFinder.repository.JobRepository;
import com.codeforworks.NTH_WorkFinder.repository.ProfessionRepository;
import com.codeforworks.NTH_WorkFinder.security.service.EmailService;
import com.codeforworks.NTH_WorkFinder.service.ICandidateService;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.mail.MessagingException;

@Service
public class CandidateService implements ICandidateService {

    private static final Logger logger = LoggerFactory.getLogger(CandidateService.class);

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private ProfessionRepository professionRepository;

    @Autowired
    private IndustryRepository industryRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private EmailService emailService;

    // Validate request 
    private void validateCandidateRequest(CandidateRequestDTO requestDTO) {
        if (requestDTO.getPhone() != null && !requestDTO.getPhone().matches("\\d{10,11}")) {
            throw new RuntimeException("Số điện thoại không hợp lệ");
        }

        if (requestDTO.getBirthday() != null) {
            Date now = new Date();
            int age = now.getYear() - requestDTO.getBirthday().getYear();
            if (age < 18) {
                throw new RuntimeException("Ứng viên phải từ 18 tuổi trở lên");
            }
        }

        if (requestDTO.getExpectedSalary() != null && requestDTO.getExpectedSalary() < 0) {
            throw new RuntimeException("Mức lương mong muốn không hợp lệ");
        }


    }

    // Thêm xác thực quyền truy cập cho candidate
    private void validateCandidateAccess(Long candidateId) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));
        if (!candidate.getUser().getAccount().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Không có quyền truy cập thông tin của candidate này");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileDTO getCandidateProfileById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));
        Hibernate.initialize(candidate.getCandidateSkills());
        candidate.getCandidateSkills().forEach(cs -> {
            Hibernate.initialize(cs.getSkill());
            Hibernate.initialize(cs.getCandidate());
        });

        return CandidateMapper.INSTANCE.toCandidateProfileDTO(candidate);
    }

    @Override
    public CandidateProfileDTO getCandidateProfileByEmail(String email) {
        Candidate candidate = candidateRepository.findByUserAccountEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate với email: " + email));
        return CandidateMapper.INSTANCE.toCandidateProfileDTO(candidate);
    }

    @Override
    public List<CandidateProfileDTO> getAllCandidates() {
        List<Candidate> candidates = candidateRepository.findAll();
        return candidates.stream()
                .map(CandidateMapper.INSTANCE::toCandidateProfileDTO)
                .collect(Collectors.toList());
    }

    // Thêm phương thức validate mối quan hệ Industry-Profession
    private void validateIndustryProfession(Long industryId, Long professionId) {
        if (industryId != null && professionId != null) {
            Profession profession = professionRepository.findById(professionId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Profession"));

            // Kiểm tra xem profession có thuộc industry không
            if (!profession.getIndustry().getId().equals(industryId)) {
                throw new RuntimeException("Profession không thuộc Industry đã chọn");
            }
        }
    }

    @Override
    @Transactional
    public CandidateProfileDTO updateCandidate(Long id, CandidateRequestDTO requestDTO) {
        validateCandidateRequest(requestDTO);

        // Validate mối quan hệ Industry-Profession
        validateIndustryProfession(requestDTO.getIndustryId(), requestDTO.getProfessionId());

        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        // Cập nhật industry trước
        if (requestDTO.getIndustryId() != null) {
            Industry industry = industryRepository.findById(requestDTO.getIndustryId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Industry"));
            candidate.setIndustry(industry);

            // Nếu đổi industry mà không chọn profession mới, xóa profession cũ
            if (requestDTO.getProfessionId() == null &&
                    candidate.getProfession() != null &&
                    !candidate.getProfession().getIndustry().getId().equals(requestDTO.getIndustryId())) {
                candidate.setProfession(null);
            }
        }

        // Cập nhật profession sau
        if (requestDTO.getProfessionId() != null) {
            Profession profession = professionRepository.findById(requestDTO.getProfessionId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Profession"));

            // Kiểm tra lại một lần nữa
            if (candidate.getIndustry() != null &&
                    !profession.getIndustry().getId().equals(candidate.getIndustry().getId())) {
                throw new RuntimeException("Profession không thuộc Industry đã chọn");
            }

            candidate.setProfession(profession);
        }

        candidate.getUser().setFullName(requestDTO.getFullName());
        candidate.setPhone(requestDTO.getPhone());
        candidate.setAddress(requestDTO.getAddress());
        candidate.setLocation(requestDTO.getLocation());
        candidate.setBirthday(requestDTO.getBirthday());
        candidate.setSex(requestDTO.getSex());
        candidate.setAvatar(requestDTO.getAvatar());
        candidate.setAttachedFile(requestDTO.getAttachedFile());
        candidate.setExpectedSalary(requestDTO.getExpectedSalary());
        candidate.setTitle(requestDTO.getTitle());
        candidate.setDescription(requestDTO.getDescription());
        candidate.setCertifications(requestDTO.getCertifications());
        candidate.setJobType(requestDTO.getJobType());
        candidate.setJobLevel(requestDTO.getJobLevel());
        candidate.setExperienceLevel(requestDTO.getExperienceLevel());
        candidate.setEducationLevel(requestDTO.getEducationLevel());
        candidate.setIsAvailable(requestDTO.getIsAvailable());

        Candidate updatedCandidate = candidateRepository.save(candidate);
        return CandidateMapper.INSTANCE.toCandidateProfileDTO(updatedCandidate);
    }

    @Override
    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy Candidate");
        }
        candidateRepository.deleteById(id);
    }

    // Cập nhật trạng thái tìm việc của ứng viên
    @Override
    public void updateAvailability(Long id, Boolean isAvailable) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));
        candidate.setIsAvailable(isAvailable);
        candidateRepository.save(candidate);
    }


    // Thêm work history cho ứng viên 
    @Override
    public CandidateProfileDTO addWorkHistory(Long id, WorkHistoryDTO workHistoryDTO) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        WorkHistory workHistory = new WorkHistory();
        workHistory.setCandidate(candidate);
        workHistory.setCompanyName(workHistoryDTO.getCompanyName());
        workHistory.setPosition(workHistoryDTO.getPosition());
        workHistory.setStartDate(workHistoryDTO.getStartDate());
        workHistory.setEndDate(workHistoryDTO.getEndDate());
        workHistory.setDescription(workHistoryDTO.getDescription());
        workHistory.setIsCurrentJob(workHistoryDTO.getIsCurrentJob());

        candidate.getWorkHistories().add(workHistory);
        candidateRepository.save(candidate);

        return CandidateMapper.INSTANCE.toCandidateProfileDTO(candidate);
    }

    // Lấy work history theo id
    @Override
    public WorkHistoryDTO getWorkHistoryById(Long candidateId, Long workHistoryId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        WorkHistory workHistory = candidate.getWorkHistories().stream()
                .filter(wh -> wh.getId().equals(workHistoryId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Work History"));

        return CandidateMapper.INSTANCE.toWorkHistoryDTO(workHistory);
    }

    // Cập nhật work history
    @Override
    @Transactional
    public WorkHistoryDTO updateWorkHistory(Long candidateId, Long workHistoryId, WorkHistoryDTO workHistoryDTO) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        WorkHistory workHistory = candidate.getWorkHistories().stream()
                .filter(wh -> wh.getId().equals(workHistoryId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Work History"));

        // Cập nhật thông tin
        workHistory.setCompanyName(workHistoryDTO.getCompanyName());
        workHistory.setPosition(workHistoryDTO.getPosition());
        workHistory.setStartDate(workHistoryDTO.getStartDate());
        workHistory.setEndDate(workHistoryDTO.getEndDate());
        workHistory.setDescription(workHistoryDTO.getDescription());
        workHistory.setIsCurrentJob(workHistoryDTO.getIsCurrentJob());

        candidateRepository.save(candidate);
        return CandidateMapper.INSTANCE.toWorkHistoryDTO(workHistory);
    }

    // Xóa work history
    @Override
    @Transactional
    public void deleteWorkHistory(Long candidateId, Long workHistoryId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        WorkHistory workHistory = candidate.getWorkHistories().stream()
                .filter(wh -> wh.getId().equals(workHistoryId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Work History"));

        candidate.getWorkHistories().remove(workHistory); // Xóa work history khỏi danh sách
        candidateRepository.save(candidate); // Lưu lại candidate để cập nhật cơ sở dữ liệu
        candidateRepository.flush(); // Đảm bảo giao dịch được cam kết
    }

    // Lấy danh sách work history của candidate
    @Override
    public List<WorkHistoryDTO> getAllWorkHistories(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        return candidate.getWorkHistories().stream()
                .map(CandidateMapper.INSTANCE::toWorkHistoryDTO)
                .collect(Collectors.toList());
    }

    // Gửi email gợi ý công việc cho candidate
    @Override
    public void sendJobSuggestionsToCandidate(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        logger.debug("Bắt đầu gửi gợi ý việc làm cho ứng viên ID: {}", candidateId);

        if (!candidate.getIsAvailable()) {
            logger.debug("Ứng viên {} không sẵn sàng tìm việc, bỏ qua gửi email.", candidateId);
            return;
        }

        // Kiểm tra thông tin hồ sơ
        if (!isProfileComplete(candidate)) {
            logger.debug("Hồ sơ ứng viên {} chưa đầy đủ. Chi tiết: location={}, address={}, skills={}, industry={}", 
                candidateId, 
                candidate.getLocation(),
                candidate.getAddress(),
                candidate.getCandidateSkills().size(),
                candidate.getIndustry());
            return;
        }

        // Lọc các công việc phù hợp
        List<Job> suitableJobs = findSuitableJobsForCandidate(candidate)
            .stream()
            .limit(5) // Giới hạn 5 việc làm gợi ý
            .collect(Collectors.toList());
        logger.debug("Tìm thấy {} việc làm phù hợp cho ứng viên {}", suitableJobs.size(), candidateId);

        // Gửi email
        if (!suitableJobs.isEmpty()) {
            try {
                String candidateEmail = candidate.getUser().getAccount().getEmail();
                logger.debug("Gửi email đến {}, số việc làm: {}", candidateEmail, suitableJobs.size());
                emailService.sendJobSuggestions(candidateEmail, suitableJobs);
                logger.info("Đã gửi email thành công cho ứng viên {}", candidateId);
            } catch (MessagingException e) {
                logger.error("Lỗi khi gửi email cho ứng viên {}: {}", candidateId, e.getMessage());
                throw new RuntimeException("Lỗi gửi email: " + e.getMessage());
            } catch (Exception e) {
                logger.error("Lỗi không xác định khi gửi email cho ứng viên {}: {}", candidateId, e.getMessage());
                throw new RuntimeException("Lỗi không xác định khi gửi email");
            }
        } else {
            logger.debug("Không có việc làm phù hợp để gửi cho ứng viên {}", candidateId);
        }
    }

    // Kiểm tra xem hồ sơ ứng viên có đầy đủ thông tin không
    private boolean isProfileComplete(Candidate candidate) {
        return candidate.getLocation() != null &&
               candidate.getAddress() != null &&
               !candidate.getCandidateSkills().isEmpty() &&
               candidate.getIndustry() != null &&
               candidate.getJobType() != null &&
               candidate.getJobLevel() != null &&
               candidate.getExperienceLevel() != null &&
               candidate.getEducationLevel() != null;
    }

    // Tìm công việc phù hợp cho ứng viên
    private List<Job> findSuitableJobsForCandidate(Candidate candidate) {
        // Giữ nguyên location match
        return jobRepository.findAll().stream()
            // Thêm điều kiện kiểm tra job đã approved
            .filter(job -> {
                boolean isApproved = job.getApproved() != null && job.getApproved();
                logger.debug("Job {}: Is approved? {}", job.getId(), isApproved);
                return isApproved;
            })
            .filter(job -> {
                boolean locationMatch = job.getLocation().equals(candidate.getLocation());
                logger.debug("Job {}: Location match? {} (job='{}', candidate='{}')", 
                    job.getId(), locationMatch, job.getLocation(), candidate.getLocation());
                return locationMatch;
            })
            // Nới lỏng industry match - cho phép match một số industry liên quan
            .filter(job -> {
                boolean industryMatch = job.getIndustry().getName().equals(candidate.getIndustry().getName()) ||
                                      isRelatedIndustry(job.getIndustry().getName(), candidate.getIndustry().getName());
                logger.debug("Job {}: Industry match? {}", job.getId(), industryMatch);
                return industryMatch;
            })
            // Bỏ điều kiện JobType match
            // Nới lỏng JobLevel match - cho phép chênh lệch 1 cấp
            .filter(job -> {
                JobLevel jobLevel = JobLevel.valueOf(job.getRequiredJobLevel().name());
                JobLevel candidateLevel = JobLevel.valueOf(candidate.getJobLevel().name());
                boolean jobLevelMatch = Math.abs(jobLevel.ordinal() - candidateLevel.ordinal()) <= 1;
                logger.debug("Job {}: JobLevel match? {}", job.getId(), jobLevelMatch);
                return jobLevelMatch;
            })
            .collect(Collectors.toList());
    }

    // Thêm hàm kiểm tra industry liên quan
    private boolean isRelatedIndustry(String jobIndustry, String candidateIndustry) {
        // Ví dụ: IT & Telecommunications có thể match với Software Development
        Map<String, List<String>> relatedIndustries = Map.of(
            "IT & Telecommunications", List.of("Software Development", "Technology", "Digital Marketing"),
            "Banking & Finance", List.of("Financial Services", "Insurance", "Investment")
            // Thêm các mapping khác
        );
        
        List<String> related = relatedIndustries.get(candidateIndustry);
        return related != null && related.contains(jobIndustry);
    }

    // Kiểm tra xem ứng viên có khả năng làm việc phù hợp với công việc 
    private boolean isProficiencyLevelCompatible(CandidateSkill.ProficiencyLevel candidateLevel, JobSkill.ProficiencyLevel jobLevel) {
        // Tạo map level với thứ tự từ thấp đến cao
        Map<String, Integer> levelMap = Map.of(
            "BEGINNER", 1,
            "INTERMEDIATE", 2,
            "ADVANCED", 3,
            "EXPERT", 4
        );

        int candidateValue = levelMap.get(candidateLevel.name());
        int jobValue = levelMap.get(jobLevel.name());

        // Nếu candidate level cao hơn hoặc bằng job level -> match
        // Hoặc nếu level chênh lệch 1 bậc -> cũng match
        return candidateValue >= jobValue || Math.abs(candidateValue - jobValue) == 1;
    }

    // // Gửi email gợi ý công việc cho tất cả các ứng viên mỗi ngày một lần
    @Scheduled(cron = "0 0 8 * * ?") // Chạy vào 8 giờ sáng mỗi ngày
    public void sendDailyJobSuggestions() {
        List<Candidate> candidates = candidateRepository.findAll();
        for (Candidate candidate : candidates) {
            try {
                sendJobSuggestionsToCandidate(candidate.getId());
            } catch (Exception e) {
                logger.error("Lỗi khi gửi email gợi ý công việc cho ứng viên {}: ", candidate.getId(), e);
            }
        }
    }

    // Lưu công việc
    @Override
    @Transactional
    public void saveJob(Long candidateId, Long jobId) {
        // Validate quyền truy cập
        validateCandidateAccess(candidateId);
        
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));
                
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job"));

        // Kiểm tra xem đã lưu job này chưa
        if (candidate.getSavedJobs().stream().anyMatch(j -> j.getId().equals(jobId))) {
            throw new RuntimeException("Công việc này đã được lưu trước đó");
        }

        candidate.getSavedJobs().add(job);
        candidateRepository.save(candidate);
    }

    // Bỏ lưu công việc
    @Override
    @Transactional
    public void unsaveJob(Long candidateId, Long jobId) {
        // Validate quyền truy cập
        validateCandidateAccess(candidateId);
        
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        // Tìm và xóa job khỏi danh sách đã lưu
        boolean removed = candidate.getSavedJobs().removeIf(job -> job.getId().equals(jobId));
        
        if (!removed) {
            throw new RuntimeException("Không tìm thấy công việc đã lưu");
        }

        candidateRepository.save(candidate);
    }

    // Lấy danh sách công việc đã lưu
    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDTO> getSavedJobs(Long candidateId) {
        // Validate quyền truy cập
        validateCandidateAccess(candidateId);
        
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        return candidate.getSavedJobs().stream()
                .map(JobMapper.INSTANCE::toJobResponseDTO)
                .collect(Collectors.toList());
    }
}

