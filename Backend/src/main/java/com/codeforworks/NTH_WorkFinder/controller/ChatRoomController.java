package com.codeforworks.NTH_WorkFinder.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.codeforworks.NTH_WorkFinder.dto.chat.ChatMessageDTO;
import com.codeforworks.NTH_WorkFinder.dto.chat.ChatRoomDTO;
import com.codeforworks.NTH_WorkFinder.model.ChatRoom;
import com.codeforworks.NTH_WorkFinder.service.IChatRoomService;

@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
@Slf4j
public class ChatRoomController {

    private static final Logger logger = LoggerFactory.getLogger(ChatRoomController.class);
    private final IChatRoomService chatRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    // Tạo phòng chat mới (EMPLOYER)
    @PostMapping("/create")
    public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestParam Long employerId, @RequestParam Long candidateId) {
        return ResponseEntity.ok(chatRoomService.createChatRoom(employerId, candidateId));
    }

    // Lấy danh sách phòng chat của user hoặc employer (EMPLOYER & USER)
    @GetMapping("/list/{userId}")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms(@PathVariable Long userId) {
        return ResponseEntity.ok(chatRoomService.getUserChatRooms(userId));
    }

    // Lấy tin nhắn trong phòng chat (EMPLOYER & USER)
    @GetMapping("/messages/{roomId}")
    public ResponseEntity<List<ChatMessageDTO>> getRoomMessages(@PathVariable String roomId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(chatRoomService.getRoomMessages(roomId, page, size));
    }

    // Gửi tin nhắn qua WebSocket (EMPLOYER & USER)
    @MessageMapping("/chat.send/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageDTO sendMessage(@DestinationVariable String roomId, @Payload ChatMessageDTO message) {
        try {
            message.setRoomId(roomId);
            message.setTimestamp(new Date());
            ChatMessageDTO savedMessage = chatRoomService.saveMessage(message);

            // Gửi thông báo cho người nhận
            Long receiverId = getReceiverId(roomId, message.getSenderId());
            messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/messages",
                savedMessage
            );

            // Cập nhật số tin nhắn chưa đọc
            int unreadCount = chatRoomService.getUnreadCount(roomId, receiverId);
            messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/unread",
                Map.of("count", unreadCount)
            );

            return savedMessage;
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage());
            throw e;
        }
    }

    private Long getReceiverId(String roomId, Long senderId) {
        ChatRoom chatRoom = chatRoomService.getChatRoomByRoomId(roomId);
        if (chatRoom.getEmployer().getId().equals(senderId)) {
            return chatRoom.getCandidate().getId();
        }
        return chatRoom.getEmployer().getId();
    }

    // Đánh dấu tin nhắn đã đọc (EMPLOYER & USER)
    @PutMapping("/messages/read")
    public ResponseEntity<Void> markMessagesAsRead(@RequestParam String roomId, @RequestParam Long userId) {
        chatRoomService.markMessagesAsRead(roomId, userId);
        return ResponseEntity.ok().build();
    }

    // Thêm endpoint test đơn giản
    @MessageMapping("/test")
    @SendTo("/topic/test")
    public String testMessage(String message) {
        System.out.println("=== TEST MESSAGE RECEIVED ===");
        System.out.println("Message content: " + message);

        String response = "Server received: " + message;
        System.out.println("Broadcasting response: " + response);

        // Log với logger
        logger.info("=== TEST MESSAGE RECEIVED ===");
        logger.info("Message content: {}", message);
        logger.info("Broadcasting response: {}", response);

        // Broadcast manually
        messagingTemplate.convertAndSend("/topic/test", response);

        return response;
    }

    // Thêm endpoint kiểm tra kết nối
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        logger.info("Testing WebSocket connection");
        return ResponseEntity.ok("WebSocket server is running");
    }

    // xóa phong chat
    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable String roomId) {
        chatRoomService.deleteChatRoom(roomId);
        return ResponseEntity.ok().build();
    }

    // lấy số tin nhắn chưa đọc
    @GetMapping("/unread/{roomId}")
    public ResponseEntity<Map<String, Integer>> getUnreadCount(
        @PathVariable String roomId,
        @RequestParam Long userId
    ) {
        try {
            int unreadCount = chatRoomService.getUnreadCount(roomId, userId);
            return ResponseEntity.ok(Map.of("count", unreadCount));
        } catch (Exception e) {
            log.error("Error getting unread count for room {} and user {}: {}",
                roomId, userId, e.getMessage());
            throw new RuntimeException("Error getting unread count", e);
        }
    }

    // lấy tổng số tin nhắn chưa đọc của user
    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Map<String, Integer>> getTotalUnreadMessages(@PathVariable Long userId) {
        try {
            int totalUnread = chatRoomService.getTotalUnreadMessages(userId);
            return ResponseEntity.ok(Map.of("count", totalUnread));
        } catch (Exception e) {
            log.error("Error getting total unread messages for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error getting unread count", e);
        }
    }

}
