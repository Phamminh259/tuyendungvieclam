package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.application.ApplicationResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;
import com.codeforworks.NTH_WorkFinder.service.IApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private IApplicationService applicationService;

    // lấy thông tin đơn ứng tuyển theo id
    @GetMapping("/get-by/{id}")
    public ResponseEntity<ApplicationResponseDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    // lấy thông tin tất cả đơn ứng tuyển
    @GetMapping("/list")
    public ResponseEntity<List<ApplicationResponseDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    // tạo đơn ứng tuyển
    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> createApplication(@RequestBody ApplicationRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.createApplication(requestDTO));
    }

    // cập nhật trạng thái đơn ứng tuyển
    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    // xóa đơn ứng tuyển
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    // lấy thông tin đơn ứng tuyển theo id công việc
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsByJobId(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    // lấy thông tin đơn ứng tuyển theo id ứng viên
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsByCandidateId(@PathVariable Long candidateId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidateId(candidateId));
    }

    // lấy thông tin ứng viên đã ứng tuyển công việc của employer
    @GetMapping("/employer/{employerId}/candidates") 
    public ResponseEntity<List<CandidateProfileDTO>> getCandidatesByEmployerId(@PathVariable Long employerId) {
        return ResponseEntity.ok(applicationService.getCandidatesByEmployerId(employerId));
    }

    // lấy thông tin ứng viên đã được chấp nhận theo id nhà tuyển dụng
    @GetMapping("/employer/{employerId}/accepted-candidates")
    public ResponseEntity<List<CandidateProfileDTO>> getAcceptedCandidatesByEmployerId(@PathVariable Long employerId) {
        return ResponseEntity.ok(applicationService.getAcceptedCandidatesByEmployerId(employerId));
    }
}
