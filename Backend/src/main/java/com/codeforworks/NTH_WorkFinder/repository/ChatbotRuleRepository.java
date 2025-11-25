package com.codeforworks.NTH_WorkFinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.codeforworks.NTH_WorkFinder.model.ChatbotRule;
import java.util.List;

@Repository
public interface ChatbotRuleRepository extends JpaRepository<ChatbotRule, Long> {
    List<ChatbotRule> findAllByOrderByPriorityDesc();
} 