package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Message;
import com.codeforworks.NTH_WorkFinder.model.ChatRoom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomRoomId(String roomId, Pageable pageable);
    List<Message> findByChatRoomRoomIdAndSenderIdNotAndIsReadFalse(String roomId, Long senderId);
    int countByChatRoomRoomIdAndSenderIdNotAndIsReadFalse(String roomId, Long userId);
    @Modifying
    @Query("DELETE FROM Message m WHERE m.chatRoom.roomId = :roomId")
    void deleteAllByRoomId(@Param("roomId") String roomId);
    // Thêm query để đếm tin nhắn chưa đọc
    @Query("SELECT COUNT(m) FROM Message m " +
           "WHERE m.chatRoom.roomId = :roomId " +
           "AND m.sender.id != :userId " +
           "AND m.isRead = false")
    int countUnreadMessages(@Param("roomId") String roomId, @Param("userId") Long userId);
    long countByChatRoomAndSenderId(ChatRoom chatRoom, Long senderId);
}
