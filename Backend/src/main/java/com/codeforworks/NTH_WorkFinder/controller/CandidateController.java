package com.codeforworks.NTH_WorkFinder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.WorkHistoryDTO;
import com.codeforworks.NTH_WorkFinder.dto.error.ErrorResponse;
import com.codeforworks.NTH_WorkFinder.service.ICandidateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private ICandidateService candidateService;

    // Lấy thông tin profile ứng viên
    @GetMapping("/get-by/{id}")
    public ResponseEntity<CandidateProfileDTO> getCandidateProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getCandidateProfileById(id));
    }

    @GetMapping("/get-by-email/{email}")
    public ResponseEntity<CandidateProfileDTO> getCandidateProfileByEmail(@PathVariable String email) {
        return ResponseEntity.ok(candidateService.getCandidateProfileByEmail(email));
    }

    // Lấy danh sách tất cả ứng viên
    @GetMapping("/list")
    public ResponseEntity<List<CandidateProfileDTO>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    // Cập nhật thông tin ứng viên
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCandidate(@PathVariable Long id, @RequestBody CandidateRequestDTO candidateDTO) {
        try {
            CandidateProfileDTO updatedProfile = candidateService.updateCandidate(id, candidateDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating candidate: " + e.getMessage());
        }
    }

    // Xóa ứng viên
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok().build();
    }

    // Cập nhật trạng thái tìm việc
    @PutMapping("/{id}/availability")
    public ResponseEntity<Void> updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean isAvailable) {
        candidateService.updateAvailability(id, isAvailable);
        return ResponseEntity.ok().build();
    }

    // Thêm kinh nghiệm làm việc (USER AND EMPLOYER CAN ADD WORK HISTORY)
    @PostMapping("/{candidateId}/work-histories")
    public ResponseEntity<?> addWorkHistory(
            @PathVariable Long candidateId,
            @Valid @RequestBody WorkHistoryDTO workHistoryDTO) {
        try {
            CandidateProfileDTO updatedProfile = candidateService.addWorkHistory(candidateId, workHistoryDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }

    // Lấy chi tiết một work history (USER AND EMPLOYER CAN GET WORK HISTORY)
    @GetMapping("/{candidateId}/work-histories/{workHistoryId}")
    public ResponseEntity<?> getWorkHistory(
            @PathVariable Long candidateId,
            @PathVariable Long workHistoryId) {
        try {
            WorkHistoryDTO workHistory = candidateService.getWorkHistoryById(candidateId, workHistoryId);
            return ResponseEntity.ok(workHistory);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }

    // Cập nhật work history (USER AND EMPLOYER CAN UPDATE WORK HISTORY)
    @PutMapping("/{candidateId}/work-histories/{workHistoryId}")
    public ResponseEntity<?> updateWorkHistory(
            @PathVariable Long candidateId,
            @PathVariable Long workHistoryId,
            @Valid @RequestBody WorkHistoryDTO workHistoryDTO) {
        try {
            WorkHistoryDTO updatedWorkHistory = candidateService.updateWorkHistory(candidateId, workHistoryId, workHistoryDTO);
            return ResponseEntity.ok(updatedWorkHistory);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }

    // Xóa work history (USER AND EMPLOYER CAN DELETE WORK HISTORY)
    @DeleteMapping("/{candidateId}/work-histories/{workHistoryId}")
    public ResponseEntity<?> deleteWorkHistory(
            @PathVariable Long candidateId,
            @PathVariable Long workHistoryId) {
        try {
            candidateService.deleteWorkHistory(candidateId, workHistoryId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }

    // Lấy danh sách work history của candidate
    @GetMapping("/{candidateId}/work-histories")
    public ResponseEntity<?> getAllWorkHistories(@PathVariable Long candidateId) {
        try {
            List<WorkHistoryDTO> workHistories = candidateService.getAllWorkHistories(candidateId);
            return ResponseEntity.ok(workHistories);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }
    // Endpoint để gửi gợi ý công việc cho ứng viên
    @PostMapping("/{candidateId}/send-job-suggestions")
    public ResponseEntity<?> sendJobSuggestions(@PathVariable Long candidateId) {
        try {
            candidateService.sendJobSuggestionsToCandidate(candidateId);
            return ResponseEntity.ok("Đã gửi gợi ý công việc cho ứng viên.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi gửi gợi ý công việc: " + e.getMessage());
        }
    }

    // Lưu công việc
    @PostMapping("/{candidateId}/save-job/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long candidateId, @PathVariable Long jobId) {
        candidateService.saveJob(candidateId, jobId);
        return ResponseEntity.ok().build();
    }

    // Lấy danh sách công việc đã lưu
    @GetMapping("/{candidateId}/saved-jobs")
    public ResponseEntity<?> getSavedJobs(@PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateService.getSavedJobs(candidateId));
    }

    // Xóa công việc đã lưu
    @DeleteMapping("/{candidateId}/saved-jobs/{jobId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long candidateId, @PathVariable Long jobId) {
        candidateService.unsaveJob(candidateId, jobId);
        return ResponseEntity.ok().build();
    }
}
