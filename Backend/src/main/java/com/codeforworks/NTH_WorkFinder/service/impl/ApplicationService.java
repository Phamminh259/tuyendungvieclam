package com.codeforworks.NTH_WorkFinder.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;
import com.codeforworks.NTH_WorkFinder.mapper.ApplicationMapper;
import com.codeforworks.NTH_WorkFinder.mapper.CandidateMapper;
import com.codeforworks.NTH_WorkFinder.model.Application;
import com.codeforworks.NTH_WorkFinder.model.Candidate;
import com.codeforworks.NTH_WorkFinder.model.Job;
import com.codeforworks.NTH_WorkFinder.repository.ApplicationRepository;
import com.codeforworks.NTH_WorkFinder.repository.CandidateRepository;
import com.codeforworks.NTH_WorkFinder.repository.JobRepository;
import com.codeforworks.NTH_WorkFinder.service.IApplicationService;
import com.codeforworks.NTH_WorkFinder.repository.InterviewRepository;
import com.codeforworks.NTH_WorkFinder.mapper.InterviewMapper;
import com.codeforworks.NTH_WorkFinder.model.Interview;
import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationWithInterviewDTO;

@Service
@Transactional
public class ApplicationService implements IApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private InterviewMapper interviewMapper;

    // lấy thông tin đơn ứng tuyển theo id
    @Override
    public ApplicationResponseDTO getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Application"));
        return ApplicationMapper.INSTANCE.toApplicationResponseDTO(application);
    }

    // lấy thông tin tất cả đơn ứng tuyển
    @Override
    public List<ApplicationResponseDTO> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();
        return applications.stream()
                .map(ApplicationMapper.INSTANCE::toApplicationResponseDTO)
                .collect(Collectors.toList());
    }

    // tạo đơn ứng tuyển
    @Override
    public ApplicationResponseDTO createApplication(ApplicationRequestDTO dto) {
        // Kiểm tra trùng lặp
        if (applicationRepository.existsByJobIdAndCandidateId(
                dto.getJobId(), dto.getCandidateId())) {
            throw new IllegalArgumentException("Bạn đã ứng tuyển công việc này rồi");
        }

        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Job"));

        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        Application application = ApplicationMapper.INSTANCE.toApplicationEntity(dto);
        application.setCode("APP-" + String.format("%05d", applicationRepository.count() + 1));
        application.setJob(job);
        application.setCandidate(candidate);
        application.setStatus(Application.ApplicationStatus.Pending);

        Application savedApplication = applicationRepository.save(application);
        jobService.incrementApplicationCount(job.getId());
        return ApplicationMapper.INSTANCE.toApplicationResponseDTO(savedApplication);
    }

    // cập nhật trạng thái đơn ứng tuyển
    @Override
    public ApplicationResponseDTO updateApplicationStatus(Long id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Application"));

        application.setStatus(Application.ApplicationStatus.valueOf(status));
        Application updatedApplication = applicationRepository.save(application);
        return ApplicationMapper.INSTANCE.toApplicationResponseDTO(updatedApplication);
    }

    // xóa đơn ứng tuyển
    @Override
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy Application");
        }
        applicationRepository.deleteById(id);
    }

    // lấy thông tin đơn ứng tuyển theo id công việc
    @Override
    public List<ApplicationResponseDTO> getApplicationsByJobId(Long jobId) {
        List<Application> applications = applicationRepository.findByJobId(jobId);
        return applications.stream()
                .map(ApplicationMapper.INSTANCE::toApplicationResponseDTO)
                .collect(Collectors.toList());
    }

    // lấy thông tin đơn ứng tuyển theo id ứng viên
    @Override
    public List<ApplicationResponseDTO> getApplicationsByCandidateId(Long candidateId) {
        List<Application> applications = applicationRepository.findByCandidateId(candidateId);
        return applications.stream()
                .map(ApplicationMapper.INSTANCE::toApplicationResponseDTO)
                .collect(Collectors.toList());
    }


    // Lấy thông tin ứng viên đã ứng tuyển công việc của employer
    @Override
    public List<CandidateProfileDTO> getCandidatesByEmployerId(Long employerId) {
        // Lấy danh sách đơn ứng tuyển theo employerId
        List<Application> applications = applicationRepository.findByJob_Employer_Id(employerId);

        // Chuyển đổi và lọc các ứng viên duy nhất
        return applications.stream()
                .map(Application::getCandidate)
                .distinct() // Loại bỏ các ứng viên trùng lặp
                .map(candidate -> {
                    CandidateProfileDTO profileDTO = CandidateMapper.INSTANCE.toCandidateProfileDTO(candidate);
                    // Lấy thông tin ứng tuyển của ứng viên cho employer này
                    List<Application> candidateApps = applications.stream()
                            .filter(app -> app.getCandidate().getId().equals(candidate.getId()))
                            .collect(Collectors.toList());

                    List<ApplicationWithInterviewDTO> applicationDTOs = candidateApps.stream()
                            .map(app -> {
                                ApplicationWithInterviewDTO appDTO = new ApplicationWithInterviewDTO();
                                appDTO.setId(app.getId());
                                appDTO.setJobTitle(app.getJob().getTitle());
                                appDTO.setStatus(app.getStatus().toString());
                                appDTO.setCreatedDate(app.getCreatedDate());

                                // Lấy interview mới nhất cho application này
                                Interview latestInterview = interviewRepository
                                        .findFirstByApplication_IdOrderByCreatedDateDesc(app.getId())
                                        .orElse(null);
                                if (latestInterview != null) {
                                    appDTO.setInterview(interviewMapper.toDTO(latestInterview));
                                }

                                return appDTO;
                            })
                            .collect(Collectors.toList());

                    profileDTO.setApplications(applicationDTOs);

                    return profileDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CandidateProfileDTO> getAcceptedCandidatesByEmployerId(Long employerId) {
        // Lấy danh sách đơn ứng tuyển đã được chấp nhận theo employerId
        List<Application> applications = applicationRepository
                .findByJob_Employer_IdAndStatus(employerId, Application.ApplicationStatus.Accepted);
        
        // Chuyển đổi và lọc các ứng viên duy nhất
        return applications.stream()
                .map(Application::getCandidate)
                .distinct() // Loại bỏ các ứng viên trùng lặp
                .map(candidate -> {
                    CandidateProfileDTO profileDTO = CandidateMapper.INSTANCE.toCandidateProfileDTO(candidate);
                    // Lấy thông tin ứng tuyển đã được chấp nhận của ứng viên cho employer này
                    List<Application> candidateApps = applications.stream()
                            .filter(app -> app.getCandidate().getId().equals(candidate.getId()))
                            .collect(Collectors.toList());
                            
                    List<ApplicationWithInterviewDTO> applicationDTOs = candidateApps.stream()
                            .map(app -> {
                                ApplicationWithInterviewDTO appDTO = new ApplicationWithInterviewDTO();
                                appDTO.setId(app.getId());
                                appDTO.setJobTitle(app.getJob().getTitle());
                                appDTO.setStatus(app.getStatus().toString());
                                appDTO.setCreatedDate(app.getCreatedDate());
                                
                                // Lấy interview mới nhất cho application này
                                Interview latestInterview = interviewRepository
                                        .findFirstByApplication_IdOrderByCreatedDateDesc(app.getId())
                                        .orElse(null);
                                if (latestInterview != null) {
                                    appDTO.setInterview(interviewMapper.toDTO(latestInterview));
                                }
                                
                                return appDTO;
                            })
                            .collect(Collectors.toList());

                    profileDTO.setApplications(applicationDTOs);
                    return profileDTO;
                })
                .collect(Collectors.toList());
    }
}
