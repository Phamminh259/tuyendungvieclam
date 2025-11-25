package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "knowledge_vectors")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeVector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_table", nullable = false)
    private String sourceTable;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "qdrant_id", nullable = false)
    private String qdrantId;

    @Lob
    private String content;

    @Lob
    private String contentSummary;

    private String category;

    @Enumerated(EnumType.STRING)
    private EmbeddingStatus embeddingStatus = EmbeddingStatus.PENDING;

    private String embeddingModel = "gemini-embedding-004";

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum EmbeddingStatus {
        PENDING, DONE, FAILED
    }
}
