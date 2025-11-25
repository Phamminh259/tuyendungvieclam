package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.chat.ChatMessageDTO;
import com.codeforworks.NTH_WorkFinder.dto.chat.ChatRoomDTO;
import com.codeforworks.NTH_WorkFinder.exception.ResourceNotFoundException;
import com.codeforworks.NTH_WorkFinder.mapper.ChatRoomMapper;
import com.codeforworks.NTH_WorkFinder.model.ChatRoom;
import com.codeforworks.NTH_WorkFinder.model.Message;
import com.codeforworks.NTH_WorkFinder.model.User;
import com.codeforworks.NTH_WorkFinder.repository.CandidateRepository;
import com.codeforworks.NTH_WorkFinder.repository.ChatRoomRepository;
import com.codeforworks.NTH_WorkFinder.repository.EmployerRepository;
import com.codeforworks.NTH_WorkFinder.repository.MessageRepository;
import com.codeforworks.NTH_WorkFinder.repository.UserRepository;
import com.codeforworks.NTH_WorkFinder.security.service.EmailService;
import com.codeforworks.NTH_WorkFinder.service.IChatRoomService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChatRoomService implements IChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final EmployerRepository employerRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final ChatRoomMapper chatRoomMapper;
    private final EmailService emailService;

    // tạo phòng chat
    @Override
    public ChatRoomDTO createChatRoom(Long employerId, Long candidateId) {
        Optional<ChatRoom> existingRoom = chatRoomRepository
            .findByEmployerIdAndCandidateId(employerId, candidateId);
        if (existingRoom.isPresent()) {
            return chatRoomMapper.toChatRoomDTO(existingRoom.get());
        }

        // Tạo phòng chat mới
        ChatRoom chatRoom = new ChatRoom();
        
        // Lấy thông tin đầy đủ của employer và candidate
        var employer = employerRepository.findById(employerId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy employer"));
        var candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy candidate"));
        
        chatRoom.setEmployer(employer);
        chatRoom.setCandidate(candidate);
        chatRoom.setRoomId(generateRoomId(employerId, candidateId));
        chatRoom.setLastMessageTime(new Date()); // Thêm thời gian tạo phòng
        chatRoom.setLastMessage("Bắt đầu cuộc trò chuyện"); // Tin nhắn mặc định

        return chatRoomMapper.toChatRoomDTO(chatRoomRepository.save(chatRoom));
    }
    // tạo id phòng chat
    private String generateRoomId(Long employerId, Long candidateId) {
        return String.format("room_%d_%d", Math.min(employerId, candidateId), 
            Math.max(employerId, candidateId));
    }

    // lấy danh sách phòng chat của người dùng
    @Override
    public List<ChatRoomDTO> getUserChatRooms(Long userId) {
        return chatRoomRepository.findByEmployerIdOrCandidateId(userId)
            .stream()
            .map(chatRoomMapper::toChatRoomDTO)
            .collect(Collectors.toList());
    }

    // lấy danh sách tin nhắn của phòng chat
    @Override
    public List<ChatMessageDTO> getRoomMessages(String roomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        return messageRepository.findByChatRoomRoomId(roomId, pageable)
            .stream()
            .map(chatRoomMapper::toChatMessageDTO)
            .collect(Collectors.toList());
    }

    // lấy phòng chat theo id
    public ChatRoom getChatRoomByRoomId(String roomId) {
        return chatRoomRepository.findByRoomId(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng chat"));
    }

    // lưu tin nhắn
    @Override
    public ChatMessageDTO saveMessage(ChatMessageDTO messageDTO) {
        // Kiểm tra quyền gửi tin nhắn
        ChatRoom chatRoom = chatRoomRepository.findByRoomId(messageDTO.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng chat"));

        User sender = userRepository.findById(messageDTO.getSenderId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người gửi"));

        // Kiểm tra người gửi có thuộc phòng chat không
        if (!isUserInChatRoom(sender.getId(), chatRoom)) {
            throw new AccessDeniedException("Không có quyền gửi tin nhắn trong phòng chat này");
        }

        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setContent(messageDTO.getContent());
        message.setSender(sender);
        message.setType(messageDTO.getType());
        message.setSenderType(messageDTO.getSenderType());

        // Kiểm tra và gửi email nếu là tin nhắn đầu tiên từ nhà tuyển dụng
        if (isFirstMessageFromEmployer(chatRoom, sender)) {
            User candidate = userRepository.findById(chatRoom.getCandidate().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ứng viên"));
            try {
                String companyName = employerRepository.findById(sender.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà tuyển dụng"))
                    .getCompanyName();

                emailService.sendFirstMessageNotification(
                    candidate.getAccount().getEmail(),
                    companyName,
                    messageDTO.getContent()
                );
            } catch (MessagingException e) {
                log.error("Error sending first message notification email: {}", e.getMessage());
            }
        }

        // Cập nhật thông tin phòng chat
        chatRoom.setLastMessage(messageDTO.getContent());
        chatRoom.setLastMessageTime(new Date());
        chatRoomRepository.save(chatRoom);

        Message savedMessage = messageRepository.save(message);
        return chatRoomMapper.toChatMessageDTO(savedMessage);
    }
    private boolean isUserInChatRoom(Long userId, ChatRoom chatRoom) {
        return chatRoom.getEmployer().getId().equals(userId) ||
               chatRoom.getCandidate().getId().equals(userId);
    }

    private boolean isFirstMessageFromEmployer(ChatRoom chatRoom, User sender) {
        return employerRepository.existsById(sender.getId()) && // Kiểm tra người gửi là nhà tuyển dụng
               messageRepository.countByChatRoomAndSenderId(chatRoom, sender.getId()) == 0; // Kiểm tra là tin nhắn đầu tiên
    }

    // xóa phong chat
    @Override
    @Transactional
    public void deleteChatRoom(String roomId) {
        // Xóa tất cả tin nhắn trong phòng chat
        messageRepository.deleteAllByRoomId(roomId);
        
        // Xóa phòng chat
        chatRoomRepository.deleteByRoomId(roomId);
    }
    
    // đánh dấu tin nhắn đã đọc
    @Override
    public void markMessagesAsRead(String roomId, Long userId) {
        List<Message> unreadMessages = messageRepository
            .findByChatRoomRoomIdAndSenderIdNotAndIsReadFalse(roomId, userId);
        unreadMessages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(unreadMessages);
    }

    // Thêm phương thức lấy số tin nhắn chưa đọc cho một phòng chat
    @Override
    public int getUnreadCount(String roomId, Long userId) {
        return messageRepository.countUnreadMessages(
            roomId, 
            userId
        );
    }

    // lấy tổng số tin nhắn chưa đọc
    @Override
    public int getTotalUnreadMessages(Long userId) {
        List<ChatRoom> userRooms = chatRoomRepository.findByEmployerIdOrCandidateId(userId);
        
        return userRooms.stream()
            .mapToInt(room -> messageRepository
                .countByChatRoomRoomIdAndSenderIdNotAndIsReadFalse(
                    room.getRoomId(), 
                    userId
                ))
            .sum();
    }
} 