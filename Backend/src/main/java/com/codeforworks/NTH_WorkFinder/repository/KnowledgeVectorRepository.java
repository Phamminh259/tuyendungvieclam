package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.KnowledgeVector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KnowledgeVectorRepository extends JpaRepository<KnowledgeVector, Long> {
    Optional<KnowledgeVector> findBySourceTableAndSourceId(String sourceTable, Long sourceId);
    List<KnowledgeVector> findByCategory(String category);
}
