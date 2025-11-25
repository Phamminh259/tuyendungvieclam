package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.job.JobSkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.JobSkillMapper;
import com.codeforworks.NTH_WorkFinder.model.Job;
import com.codeforworks.NTH_WorkFinder.model.JobSkill;
import com.codeforworks.NTH_WorkFinder.model.Skill;
import com.codeforworks.NTH_WorkFinder.repository.JobRepository;
import com.codeforworks.NTH_WorkFinder.repository.JobSkillRepository;
import com.codeforworks.NTH_WorkFinder.repository.SkillRepository;
import com.codeforworks.NTH_WorkFinder.service.IJobSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobSkillService implements IJobSkillService {

    @Autowired
    private JobSkillRepository jobSkillRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public JobSkillResponseDTO createJobSkill(JobSkillRequestDTO jobSkillRequestDTO) {
        Job job = jobRepository.findById(jobSkillRequestDTO.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Skill skill = skillRepository.findById(jobSkillRequestDTO.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (jobSkillRepository.existsByJobIdAndSkillId(
                jobSkillRequestDTO.getJobId(), 
                jobSkillRequestDTO.getSkillId())) {
            throw new IllegalArgumentException(
                "Skill này đã tồn tại cho job với ID: " + jobSkillRequestDTO.getJobId());
        }

        JobSkill jobSkill = JobSkillMapper.INSTANCE.toJobSkillEntity(jobSkillRequestDTO);
        jobSkill.setJob(job);
        jobSkill.setSkill(skill);

        JobSkill savedJobSkill = jobSkillRepository.save(jobSkill);
        return JobSkillMapper.INSTANCE.toJobSkillResponseDTO(savedJobSkill);
    }

    @Override
    public List<JobSkillResponseDTO> getJobSkillsByJobId(Long jobId) {
        List<JobSkill> jobSkills = jobSkillRepository.findByJobId(jobId);
        return jobSkills.stream()
                .map(JobSkillMapper.INSTANCE::toJobSkillResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobSkillResponseDTO updateJobSkill(Long id, JobSkillRequestDTO jobSkillRequestDTO) {
        JobSkill jobSkill = jobSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("JobSkill not found"));

        if (jobSkillRequestDTO.getSkillId() != null 
            && !jobSkill.getSkill().getId().equals(jobSkillRequestDTO.getSkillId())) {
            
            if (jobSkillRepository.existsByJobIdAndSkillId(
                    jobSkill.getJob().getId(), 
                    jobSkillRequestDTO.getSkillId())) {
                throw new IllegalArgumentException(
                    "Skill này đã tồn tại cho job với ID: " + jobSkill.getJob().getId());
            }

            Skill newSkill = skillRepository.findById(jobSkillRequestDTO.getSkillId())
                    .orElseThrow(() -> new RuntimeException("Skill not found"));
            jobSkill.setSkill(newSkill);
        }

        if (jobSkillRequestDTO.getProficiencyLevel() != null) {
            jobSkill.setProficiencyLevel(JobSkill.ProficiencyLevel.valueOf(jobSkillRequestDTO.getProficiencyLevel()));
        }
        if (jobSkillRequestDTO.getDescription() != null) {
            jobSkill.setDescription(jobSkillRequestDTO.getDescription());
        }
        if (jobSkillRequestDTO.getIsRequired() != null) {
            jobSkill.setIsRequired(jobSkillRequestDTO.getIsRequired());
        }

        JobSkill updatedJobSkill = jobSkillRepository.save(jobSkill);
        return JobSkillMapper.INSTANCE.toJobSkillResponseDTO(updatedJobSkill);
    }

    @Override
    public void deleteJobSkill(Long id) {
        if (!jobSkillRepository.existsById(id)) {
            throw new RuntimeException("JobSkill not found");
        }
        jobSkillRepository.deleteById(id);
    }

    // Thêm nhiều skills cho job
    @Override
    public List<JobSkillResponseDTO> createMultipleJobSkills(Long jobId, List<JobSkillRequestDTO> skillRequests) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Set<Long> requestSkillIds = skillRequests.stream()
                .map(JobSkillRequestDTO::getSkillId)
                .collect(Collectors.toSet());
        if (requestSkillIds.size() < skillRequests.size()) {
            throw new IllegalArgumentException("Có skill bị trùng lặp trong danh sách yêu cầu");
        }

        List<JobSkill> existingSkills = jobSkillRepository.findByJobId(jobId);
        Set<Long> existingSkillIds = existingSkills.stream()
                .map(js -> js.getSkill().getId())
                .collect(Collectors.toSet());

        for (Long skillId : requestSkillIds) {
            if (existingSkillIds.contains(skillId)) {
                throw new IllegalArgumentException("Skill với ID " + skillId + " đã tồn tại cho job này");
            }
        }

        List<JobSkill> jobSkills = skillRequests.stream()
                .map(request -> {
                    Skill skill = skillRepository.findById(request.getSkillId())
                            .orElseThrow(() -> new RuntimeException("Skill not found"));

                    JobSkill jobSkill = new JobSkill();
                    jobSkill.setJob(job);
                    jobSkill.setSkill(skill);
                    jobSkill.setProficiencyLevel(JobSkill.ProficiencyLevel.valueOf(request.getProficiencyLevel()));
                    jobSkill.setDescription(request.getDescription());
                    jobSkill.setIsRequired(request.getIsRequired());
                    return jobSkill;
                })
                .collect(Collectors.toList());

        List<JobSkill> savedJobSkills = jobSkillRepository.saveAll(jobSkills);
        return savedJobSkills.stream()
                .map(JobSkillMapper.INSTANCE::toJobSkillResponseDTO)
                .collect(Collectors.toList());
    }

    // Lấy các skills bắt buộc cho job
    @Override
    public List<JobSkillResponseDTO> getRequiredJobSkills(Long jobId) {
        List<JobSkill> requiredSkills = jobSkillRepository.findByJobIdAndIsRequiredTrue(jobId);
        return requiredSkills.stream()
                .map(JobSkillMapper.INSTANCE::toJobSkillResponseDTO)
                .collect(Collectors.toList());
    }

    // Lấy các skills theo độ khả năng cho job
    @Override
    public List<JobSkillResponseDTO> getJobSkillsByProficiencyLevel(Long jobId, String proficiencyLevel) {
        List<JobSkill> skills = jobSkillRepository.findByJobIdAndProficiencyLevel(
            jobId, JobSkill.ProficiencyLevel.valueOf(proficiencyLevel));
        return skills.stream()
                .map(JobSkillMapper.INSTANCE::toJobSkillResponseDTO)
                .collect(Collectors.toList());
    }
}
