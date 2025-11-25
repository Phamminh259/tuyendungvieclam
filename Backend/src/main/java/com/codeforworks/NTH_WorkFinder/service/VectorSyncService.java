package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.model.KnowledgeVector;
import com.codeforworks.NTH_WorkFinder.repository.JobRepository;
import com.codeforworks.NTH_WorkFinder.repository.KnowledgeVectorRepository;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Points;
import io.qdrant.client.grpc.Points.PointStruct;
import io.qdrant.client.grpc.Points.Vector;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static io.qdrant.client.ValueFactory.value;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VectorSyncService {

    private final EmbeddingService embeddingService;
    private final QdrantService qdrantService;
    private final KnowledgeVectorRepository knowledgeVectorRepository;
    private final JobRepository jobRepository;

    /**
     * Đồng bộ dữ liệu từ 1 bảng cụ thể (vd: job)
     */
    @Transactional
    public void syncJobData(List<Map<String, Object>> jobDataList) {
        for (Map<String, Object> job : jobDataList) {
            try {
                Long id = ((Number) job.get("id")).longValue();
                String title = Objects.toString(job.get("title"), "");
                String description = Objects.toString(job.get("description"), "");
                String salary = Objects.toString(job.get("salary"), "Thỏa thuận");
                String location = Objects.toString(job.get("location"), "");
                String experience = Objects.toString(job.get("experience"), "Không yêu cầu");
                String company = Objects.toString(job.get("company_name"), "");
                String industry = Objects.toString(job.get("industry_name"), "");
                List<String> skills = (List<String>) job.getOrDefault("skills", List.of());

                String content = String.format("""
                        Vị trí: %s
                        Công ty: %s
                        Mức lương: %s
                        Kĩ năng yêu cầu: %s
                        Kinh nghiệm: %s
                        Địa điểm: %s
                        Ngành nghề: %s
                        Mô tả: %s
                        """, title, company, salary, String.join(", ", skills),
                        experience, location, industry, description);

                float[] embedding = embeddingService.embed(content);
                if (embedding.length == 0) continue;

                String uuid = UUID.randomUUID().toString();

                PointStruct point = PointStruct.newBuilder()
                        .setId(Points.PointId.newBuilder().setUuid(uuid).build())
                        .putPayload("job_id", value(id))
                        .putPayload("title", value(title))
                        .putPayload("company", value(company))
                        .putPayload("salary", value(salary))
                        .putPayload("location", value(location))
                        .putPayload("skills", value(String.join(", ", skills)))
                        .putPayload("industry", value(industry))
                        .putPayload("experience", value(experience))
                        .putPayload("expires_at", value(Objects.toString(job.get("end_date"), "")))
                        .putPayload("content", value(content))
                        .setVectors(Points.Vectors.newBuilder()
                                .setVector(Vector.newBuilder()
                                        .addAllData(toFloatList(embedding)).build())
                                .build())
                        .build();

                qdrantService.getClient().upsertAsync(
                        qdrantService.getCollection(),
                        List.of(point), null
                ).get();

                knowledgeVectorRepository.save(KnowledgeVector.builder()
                        .sourceTable("job")
                        .sourceId(id)
                        .qdrantId(uuid)
                        .content(content)
                        .category("job")
                        .embeddingStatus(KnowledgeVector.EmbeddingStatus.DONE)
                        .build());

            } catch (Exception ignored) { }
        }
    }
// chạy update dữ liệu vào Qdrant và db
//    @PostConstruct
    public void runOnStartup() {
        log.info("🚀 Tự động đồng bộ JOB -> VECTOR khi khởi động");

        List<Map<String, Object>> jobDataList = jobRepository.findAllWithDetails().stream()
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

        syncJobData(jobDataList);
    }

    private List<Float> toFloatList(float[] arr) {
        List<Float> list = new ArrayList<>(arr.length);
        for (float f : arr) list.add(f);
        return list;
    }
}
