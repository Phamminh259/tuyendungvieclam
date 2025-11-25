package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IJobSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-skills")
public class JobSkillController {

    @Autowired
    private IJobSkillService jobSkillService;


    // Tạo một skill cho job
    @PostMapping
    public ResponseEntity<JobSkillResponseDTO> createJobSkill(@RequestBody JobSkillRequestDTO jobSkillRequestDTO) {
        JobSkillResponseDTO createdJobSkill = jobSkillService.createJobSkill(jobSkillRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJobSkill);
    }

    // Lấy các skill cho job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobSkillResponseDTO>> getJobSkillsByJobId(@PathVariable Long jobId) {
        List<JobSkillResponseDTO> jobSkills = jobSkillService.getJobSkillsByJobId(jobId);
        return ResponseEntity.ok(jobSkills);
    }

    // Cập nhật một skill cho job
    @PutMapping("/{id}")
    public ResponseEntity<JobSkillResponseDTO> updateJobSkill(
            @PathVariable Long id,
            @RequestBody JobSkillRequestDTO jobSkillRequestDTO) {
        JobSkillResponseDTO updatedJobSkill = jobSkillService.updateJobSkill(id, jobSkillRequestDTO);
        return ResponseEntity.ok(updatedJobSkill);
    }

    // Xóa một skill cho job    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobSkill(@PathVariable Long id) {
        jobSkillService.deleteJobSkill(id);
        return ResponseEntity.noContent().build();
    }

    // Tạo nhiều skill cho job
    @PostMapping("/batch/{jobId}")
    public ResponseEntity<List<JobSkillResponseDTO>> createMultipleJobSkills(
            @PathVariable Long jobId,
            @RequestBody List<JobSkillRequestDTO> skillRequests) {
        List<JobSkillResponseDTO> createdSkills = jobSkillService.createMultipleJobSkills(jobId, skillRequests);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSkills);
    }

    // Lấy các skill bắt buộc cho job
    @GetMapping("/job/{jobId}/required")
    public ResponseEntity<List<JobSkillResponseDTO>> getRequiredJobSkills(@PathVariable Long jobId) {
        List<JobSkillResponseDTO> requiredSkills = jobSkillService.getRequiredJobSkills(jobId);
        return ResponseEntity.ok(requiredSkills);
    }

    // Lấy các skill theo độ khả năng cho job   
    @GetMapping("/job/{jobId}/level/{proficiencyLevel}")
    public ResponseEntity<List<JobSkillResponseDTO>> getJobSkillsByProficiencyLevel(
            @PathVariable Long jobId,
            @PathVariable String proficiencyLevel) {
        List<JobSkillResponseDTO> skills = jobSkillService.getJobSkillsByProficiencyLevel(jobId, proficiencyLevel);
        return ResponseEntity.ok(skills);
    }
}
