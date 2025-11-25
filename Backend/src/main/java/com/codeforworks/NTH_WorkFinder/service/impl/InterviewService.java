package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewResponseDTO;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.model.Application;
import com.codeforworks.NTH_WorkFinder.model.Interview;
import com.codeforworks.NTH_WorkFinder.repository.ApplicationRepository;
import com.codeforworks.NTH_WorkFinder.repository.InterviewRepository;
import com.codeforworks.NTH_WorkFinder.security.service.EmailService;
import com.codeforworks.NTH_WorkFinder.service.IInterviewService;
import com.codeforworks.NTH_WorkFinder.mapper.InterviewMapper;
import com.codeforworks.NTH_WorkFinder.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InterviewService implements IInterviewService {
    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewMapper interviewMapper;
    private final NotificationService notificationService;
    private final EmailService emailService;

    // Tạo phỏng vấn
    @Override
    public InterviewResponseDTO createInterview(InterviewRequestDTO requestDTO) {
        Application application = applicationRepository.findById(requestDTO.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển"));
                
        Interview interview = new Interview();
        interview.setApplication(application);
        
        interview.setCode("INT-" + String.format("%05d", interviewRepository.count() + 1));
        interview.setTitle(requestDTO.getTitle());
        interview.setInterviewDate(requestDTO.getInterviewDate());
        interview.setInterviewTime(requestDTO.getInterviewTime());
        interview.setType(Interview.InterviewType.valueOf(requestDTO.getType().toUpperCase()));
        interview.setLocation(requestDTO.getLocation());
        interview.setNote(requestDTO.getNote());
        interview.setStatus(Interview.InterviewStatus.SCHEDULED);

        Interview savedInterview = interviewRepository.save(interview);

        // Gửi thông báo
        notificationService.createNotification(
            application.getCandidate().getUser().getAccount().getId(),
            "Lịch phỏng vấn mới",
            "Bạn có lịch phỏng vấn cho vị trí " + application.getJob().getTitle(),
            Notification.NotificationType.INTERVIEW_INVITATION,
            "/interviews/" + savedInterview.getId()
        );

        // Gửi email
        emailService.sendInterviewInvitation(savedInterview);

        return interviewMapper.toDTO(savedInterview);
    }

    @Override
    public InterviewResponseDTO getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phỏng vấn"));
        return interviewMapper.toDTO(interview);
    }

    @Override
    public List<InterviewResponseDTO> getInterviewsByApplication(Long applicationId) {
        return interviewRepository.findByApplication_Id(applicationId).stream()
            .map(interviewMapper::toDTO)
            .toList();
    }

    @Override
    public List<InterviewResponseDTO> getInterviewsByEmployer(Long employerId) {
        return interviewRepository.findByApplication_Job_Employer_Id(employerId).stream()
            .map(interviewMapper::toDTO)
            .toList();
    }

    @Override
    public List<InterviewResponseDTO> getInterviewsByCandidate(Long candidateId) {
        return interviewRepository.findByApplication_Candidate_Id(candidateId).stream()
            .map(interviewMapper::toDTO)
            .toList();
    }

    @Override
    public void updateInterviewStatus(Long id, String status) {
        Interview interview = interviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phỏng vấn"));

        Interview.InterviewStatus newStatus = Interview.InterviewStatus.valueOf(status.toUpperCase());
        interview.setStatus(newStatus);
        interviewRepository.save(interview);

        // Gửi thông báo cho nhà tuyển dụng
        String message = switch (newStatus) {
            case COMPLETED -> "Phỏng vấn đã hoàn thành";
            case CANCELLED -> "Phỏng vấn đã bị hủy";
            default -> "Trạng thái phỏng vấn đã được cập nhật";
        };

        notificationService.createNotification(
            interview.getApplication().getJob().getEmployer().getAccount().getId(),
            "Cập nhật trạng thái phỏng vấn",
            message,
            Notification.NotificationType.INTERVIEW_INVITATION,
            "/interviews/" + id
        );
    }

    @Override
    public void cancelInterview(Long id) {
        Interview interview = interviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phỏng vấn"));

        interview.setStatus(Interview.InterviewStatus.CANCELLED);
        interviewRepository.save(interview);

        // Gửi thông báo cho ứng viên
        notificationService.createNotification(
            interview.getApplication().getCandidate().getUser().getAccount().getId(),
            "Phỏng vấn đã bị hủy",
            "Buổi phỏng vấn cho vị trí " + interview.getApplication().getJob().getTitle() + " đã bị hủy",
            Notification.NotificationType.INTERVIEW_INVITATION,
            "/interviews/" + id
        );
    }


    // Cập nhật phỏng vấn theo applicationId
    @Override
    public InterviewResponseDTO updateInterview(Long applicationId, InterviewRequestDTO requestDTO) {
        // Tìm interview mới nhất theo applicationId
        Interview interview = interviewRepository.findFirstByApplication_IdOrderByCreatedDateDesc(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phỏng vấn cho đơn ứng tuyển này"));
        
        // Cập nhật thông tin
        interview.setTitle(requestDTO.getTitle());
        interview.setInterviewDate(requestDTO.getInterviewDate());
        interview.setInterviewTime(requestDTO.getInterviewTime());
        interview.setType(Interview.InterviewType.valueOf(requestDTO.getType().toUpperCase()));
        interview.setLocation(requestDTO.getLocation());
        interview.setNote(requestDTO.getNote());
        
        Interview updatedInterview = interviewRepository.save(interview);
        
        // Gửi thông báo cho ứng viên về việc cập nhật lịch phỏng vấn
        notificationService.createNotification(
            interview.getApplication().getCandidate().getUser().getAccount().getId(),
            "Cập nhật lịch phỏng vấn",
            "Lịch phỏng vấn cho vị trí " + interview.getApplication().getJob().getTitle() + " đã được cập nhật",
            Notification.NotificationType.INTERVIEW_INVITATION,
            "/interviews/" + updatedInterview.getId()
        );
        
        return interviewMapper.toDTO(updatedInterview);
    }
} 