package com.codeforworks.NTH_WorkFinder.service;

import java.util.List;

import com.codeforworks.NTH_WorkFinder.dto.chat.ChatMessageDTO;
import com.codeforworks.NTH_WorkFinder.dto.chat.ChatRoomDTO;
import com.codeforworks.NTH_WorkFinder.model.ChatRoom;

public interface IChatRoomService {
    ChatRoomDTO createChatRoom(Long employerId, Long candidateId);
    List<ChatRoomDTO> getUserChatRooms(Long userId);
    List<ChatMessageDTO> getRoomMessages(String roomId, int page, int size);
    ChatRoom getChatRoomByRoomId(String roomId);
    ChatMessageDTO saveMessage(ChatMessageDTO messageDTO);
    void markMessagesAsRead(String roomId, Long userId);
    void deleteChatRoom(String roomId);
    int getTotalUnreadMessages(Long userId);
    int getUnreadCount(String roomId, Long userId);
} 