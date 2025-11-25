package com.codeforworks.NTH_WorkFinder.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import com.codeforworks.NTH_WorkFinder.model.Candidate;
import com.codeforworks.NTH_WorkFinder.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import java.util.Date;

@Aspect // cross-cutting concerns
@Component
@RequiredArgsConstructor
public class CandidateActivityAspect {
    
    private final CandidateRepository candidateRepository;

    @Pointcut("execution(* com.codeforworks.NTH_WorkFinder.service.impl.CandidateService.*(..))" +
              "|| execution(* com.codeforworks.NTH_WorkFinder.service.impl.ApplicationService.*(..))")
    public void candidateActivityMethods() {}

    
    @After("candidateActivityMethods() && args(candidateId,..)")
    public void updateLastActive(JoinPoint joinPoint, Long candidateId) {
        try {
            Candidate candidate = candidateRepository.findById(candidateId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));
            
            candidate.setLastActive(new Date());
            candidateRepository.save(candidate);
        } catch (Exception e) {
            // Log lỗi nhưng không ảnh hưởng đến luồng chính
            e.printStackTrace();
        }
    }
} 