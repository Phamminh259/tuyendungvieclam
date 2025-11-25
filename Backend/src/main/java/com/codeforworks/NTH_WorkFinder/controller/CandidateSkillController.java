package com.codeforworks.NTH_WorkFinder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.ICandidateSkillService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/candidate-skills")
public class CandidateSkillController {

    @Autowired
    private ICandidateSkillService candidateSkillService;

    // Thêm kỹ năng cho ứng viên
    @PostMapping("/{candidateId}")
    public ResponseEntity<CandidateProfileDTO> addSkillToCandidate(
            @PathVariable Long candidateId,
            @Valid @RequestBody CandidateSkillRequestDTO requestDTO) {
        return ResponseEntity.ok(candidateSkillService.addSkillToCandidate(candidateId, requestDTO));
    }

    // Lấy danh sách kỹ năng của ứng viên
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<CandidateSkillResponseDTO>> getCandidateSkillsByCandidateId(
            @PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateSkillService.getCandidateSkillsByCandidateId(candidateId));
    }

    //xóa kỹ năng theo candidate-skill-id
    @DeleteMapping("/{candidateSkillId}")
    public ResponseEntity<Void> deleteCandidateSkill(
            @PathVariable Long candidateSkillId) {
        candidateSkillService.deleteCandidateSkill(candidateSkillId);
        return ResponseEntity.ok().build();
    }

    // Xóa kỹ năng của ứng viên
    @DeleteMapping("/{candidateId}/skills/{skillId}")
    public ResponseEntity<Void> removeSkillFromCandidate(
            @PathVariable Long candidateId,
            @PathVariable Long skillId) {
        candidateSkillService.removeSkillFromCandidate(candidateId, skillId);
        return ResponseEntity.ok().build();
    }

    // Cập nhật mức độ thành thạo
    @PutMapping("/{candidateId}/skills/{skillId}")
    public ResponseEntity<CandidateSkillResponseDTO> updateProficiencyLevel(
            @PathVariable Long candidateId,
            @PathVariable Long skillId,
            @RequestParam String proficiencyLevel) {
        return ResponseEntity.ok(candidateSkillService.updateProficiencyLevel(
            candidateId, skillId, proficiencyLevel));
    }
}
