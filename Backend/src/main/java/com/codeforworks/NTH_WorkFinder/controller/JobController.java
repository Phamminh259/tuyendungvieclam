package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.job.JobRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IJobService;
import com.codeforworks.NTH_WorkFinder.service.impl.JobPostingService;
import com.codeforworks.NTH_WorkFinder.dto.job.JobPostingQuotaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private IJobService jobService;

    @Autowired
    private JobPostingService jobPostingService;

    // Tạo một công việc mới
    @PostMapping
    public ResponseEntity<JobResponseDTO> createJob(@RequestBody JobRequestDTO jobRequestDTO) {
        JobResponseDTO createdJob = jobService.createJob(jobRequestDTO);
        return ResponseEntity.ok(createdJob);
    }

    // Lấy thông tin một công việc theo ID
    @GetMapping("/get-by/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id) {
        JobResponseDTO job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    // Lấy danh sách tất cả công việc
    @GetMapping("/list")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs() {
        List<JobResponseDTO> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    // Lấy công việc theo id nhà tuyển dụng
    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<JobResponseDTO>> getJobsByEmployerId(@PathVariable Long employerId) {
        List<JobResponseDTO> jobs = jobService.getJobsByEmployerId(employerId);
        return ResponseEntity.ok(jobs);
    }

    // Cập nhật thông tin công việc theo ID
    @PutMapping("/{id}")
    public ResponseEntity<JobResponseDTO> updateJob(
            @PathVariable Long id,
            @RequestBody JobRequestDTO jobRequestDTO) {
        JobResponseDTO updatedJob = jobService.updateJob(id, jobRequestDTO);
        return ResponseEntity.ok(updatedJob);
    }

    // Xóa công việc theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint lấy công việc hot
    @GetMapping("/hot")
    public ResponseEntity<List<JobResponseDTO>> getHotJobs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(jobService.getTopViewedJobs(limit));
    }

    // Endpoint lấy công việc mới
    @GetMapping("/latest")
    public ResponseEntity<List<JobResponseDTO>> getLatestJobs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(jobService.getRecentJobs(limit));
    }

    // Duyệt công việc của nhà tuyển dụng
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN mới có quyền duyệt
    public ResponseEntity<JobResponseDTO> approveJob(@PathVariable Long id) {
        JobResponseDTO approvedJob = jobService.approveJob(id);
        return ResponseEntity.ok(approvedJob);
    }

    //  Từ chối công việc của nhà tuyển dụng
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN mới có quyền duyệt
    public ResponseEntity<JobResponseDTO> rejectJob(@PathVariable Long id) {
        JobResponseDTO rejectedJob = jobService.rejectJob(id);
        return ResponseEntity.ok(rejectedJob);
    }

    // Lấy giới hạn tin thường và tin nổi bật
    @GetMapping("/quota/{employerId}")
    public ResponseEntity<JobPostingQuotaDTO> getJobPostingQuota(@PathVariable Long employerId) {
        return ResponseEntity.ok(jobPostingService.getJobPostingQuota(employerId));
    }

}
