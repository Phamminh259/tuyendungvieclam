package com.codeforworks.NTH_WorkFinder.config;
import com.codeforworks.NTH_WorkFinder.model.Job;
import com.codeforworks.NTH_WorkFinder.repository.JobRepository;
import com.codeforworks.NTH_WorkFinder.repository.KnowledgeVectorRepository;
import com.codeforworks.NTH_WorkFinder.service.EmbeddingService;
import com.codeforworks.NTH_WorkFinder.service.QdrantService;
import com.codeforworks.NTH_WorkFinder.service.VectorSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;


@Component
@RequiredArgsConstructor
@Slf4j
public class VectorSyncJob {

    private final JobRepository jobRepository;
    private final VectorSyncService vectorSyncService; // <-- thêm
    private Date lastSyncTime = new Date(0);
// lần đầu chạy, chạy đồng bộ sau đó bn h
    @Scheduled(initialDelay = 120 * 60 * 1000, fixedRate = 120 * 60 * 1000)
    public void syncNewOrUpdatedJobs() {
        log.info("🚀 Đồng bộ JOB mới / cập nhật -> VECTOR");

        List<Job> jobsToSync = jobRepository.findAllWithDetails().stream()
                .filter(job -> job.getCreatedDate().after(lastSyncTime)
                        || job.getUpdatedDate().after(lastSyncTime))
                .collect(Collectors.toList());

        List<Map<String, Object>> jobDataList = jobsToSync.stream()
                .map(job -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", job.getId());
                    map.put("title", job.getTitle());
                    map.put("description", job.getDescription());
                    map.put("salary", job.getSalary() != null ? job.getSalary().toString() : "Thỏa thuận");
                    map.put("location", job.getLocation());
                    map.put("experience", job.getRequiredExperienceLevel() != null
                            ? job.getRequiredExperienceLevel().name() : "Không yêu cầu");
                    map.put("company_name", job.getEmployer() != null ? job.getEmployer().getCompanyName() : "");
                    map.put("industry_name", job.getIndustry() != null ? job.getIndustry().getName() : "");
                    List<String> skills = job.getJobSkills() != null
                            ? job.getJobSkills().stream().map(js -> js.getSkill().getSkillName()).toList()
                            : List.of();
                    map.put("skills", skills);
                    map.put("end_date", job.getExpiryDate());
                    return map;
                })
                .collect(Collectors.toList());

        // Gọi phương thức từ service
        vectorSyncService.syncJobData(jobDataList);

        lastSyncTime = new Date();
    }
}