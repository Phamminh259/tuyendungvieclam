package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    @Query("SELECT c FROM ChatRoom c WHERE c.employer.id = :employerId AND c.candidate.id = :candidateId")
    Optional<ChatRoom> findByEmployerIdAndCandidateId(
        @Param("employerId") Long employerId, 
        @Param("candidateId") Long candidateId
    );
    
    @Query("SELECT c FROM ChatRoom c WHERE c.employer.id = :userId OR c.candidate.id = :userId")
    List<ChatRoom> findByEmployerIdOrCandidateId(@Param("userId") Long userId);
    
    Optional<ChatRoom> findByRoomId(String roomId);
    
    void deleteByRoomId(String roomId);
    
    List<ChatRoom> findByEmployerIdOrCandidateId(Long employerId, Long candidateId);
}
