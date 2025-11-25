package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {
    private final IInterviewService interviewService;

    // Tạo phỏng vấn mới (EMPLOYER)
    @PostMapping
    public ResponseEntity<InterviewResponseDTO> createInterview(@RequestBody InterviewRequestDTO requestDTO) {
        return ResponseEntity.ok(interviewService.createInterview(requestDTO));
    }

    // Lấy chi tiết phỏng vấn (EMPLOYER + USER)
    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponseDTO> getInterview(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    // Lấy danh sách phỏng vấn theo đơn ứng tuyển (EMPLOYER + USER)
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<InterviewResponseDTO>> getInterviewsByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getInterviewsByApplication(applicationId));
    }

    // Lấy danh sách phỏng vấn của nhà tuyển dụng (EMPLOYER)
    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<InterviewResponseDTO>> getInterviewsByEmployer(@PathVariable Long employerId) {
        return ResponseEntity.ok(interviewService.getInterviewsByEmployer(employerId));
    }

    // Lấy danh sách phỏng vấn của ứng viên (USER)
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<InterviewResponseDTO>> getInterviewsByCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(interviewService.getInterviewsByCandidate(candidateId));
    }

    // Cập nhật trạng thái phỏng vấn (USER)
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateInterviewStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        interviewService.updateInterviewStatus(id, status);
        return ResponseEntity.ok().build();
    }

    // Hủy phỏng vấn (EMPLOYER)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelInterview(@PathVariable Long id) {
        interviewService.cancelInterview(id);
        return ResponseEntity.ok().build();
    }

    // Cập nhật phỏng vấn theo applicationId (EMPLOYER)
    @PutMapping("/application/{applicationId}")
    @PreAuthorize("hasRole('EMPLOYER')")  // Chỉ EMPLOYER mới được cập nhật
    public ResponseEntity<InterviewResponseDTO> updateInterview(
            @PathVariable Long applicationId,
            @RequestBody InterviewRequestDTO requestDTO) {
        return ResponseEntity.ok(interviewService.updateInterview(applicationId, requestDTO));
    }
} 