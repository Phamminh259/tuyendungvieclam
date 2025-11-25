package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.employer.EmployerStatisticsDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobResponseDTO;
import com.codeforworks.NTH_WorkFinder.dto.subscription.SubscriptionResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Employer;
import com.codeforworks.NTH_WorkFinder.service.IEmployerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {

    @Autowired
    private IEmployerService employerService;

    //    Lấy thông tin NTD theo ID
    @GetMapping("/get-by/{id}")
    public ResponseEntity<EmployerResponseDTO> getEmployerById(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.getEmployerById(id));
    }

    // Lấy thông tin NTD theo email
    @GetMapping("/get-by-email/{email}")
    public ResponseEntity<EmployerResponseDTO> getEmployerByEmail(@PathVariable String email) {
        return ResponseEntity.ok(employerService.getEmployerByEmail(email));
    }

    //     Lấy danh sách tất cả NTD
    @GetMapping("/list")
    public ResponseEntity<List<EmployerResponseDTO>> getAllEmployers() {
        return ResponseEntity.ok(employerService.getAllEmployers());
    }

    //    Cập nhật thông tin NTD
    @PutMapping("/{id}")
    public ResponseEntity<EmployerResponseDTO> updateEmployer(
            @PathVariable Long id,
            @Valid @RequestBody EmployerRequestDTO employerRequestDTO) {
        return ResponseEntity.ok(employerService.updateEmployer(id, employerRequestDTO));
    }

    //     Xóa NTD khỏi hệ thống
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployer(@PathVariable Long id) {
        employerService.deleteEmployer(id);
        return ResponseEntity.ok().build();
    }

    //    Lấy danh sách gói dịch vụ của NTD
    @GetMapping("/{id}/subscriptions")
    public ResponseEntity<List<SubscriptionResponseDTO>> getEmployerSubscriptions(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.getEmployerSubscriptions(id));
    }

    // Thêm endpoint tìm kiếm nhà tuyển dụng
    @GetMapping("/search")
    public ResponseEntity<List<EmployerResponseDTO>> searchEmployers(
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long industryId) {
        return ResponseEntity.ok(employerService.searchEmployers(companyName, location, industryId));
    }

    // Thêm endpoint lấy danh sách job của employer
    @GetMapping("/{id}/jobs")
    public ResponseEntity<List<JobResponseDTO>> getEmployerJobs(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.getEmployerJobs(id));
    }

    // Thêm endpoint thống kê
    @GetMapping("/{id}/statistics")
    public ResponseEntity<EmployerStatisticsDTO> getEmployerStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.getEmployerStatistics(id));
    }

    // Duyệt tài khoản nhà tuyển dụng
    @PutMapping("/approve/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // Chỉ ADMIN mới có quyền duyệt
    public ResponseEntity<?> approveEmployer(@PathVariable Long id) {
        try {
            Employer approvedEmployer = employerService.approveEmployer(id);
            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Đã duyệt thành công nhà tuyển dụng",
                            "employerId", approvedEmployer.getId()
                    ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Tạm ngưng tài khoản nhà tuyển dụng
    @PutMapping("/suspend/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // Chỉ ADMIN mới có quyền duyệt
    public ResponseEntity<?> suspendEmployer(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.suspendEmployer(id));
    }

}
