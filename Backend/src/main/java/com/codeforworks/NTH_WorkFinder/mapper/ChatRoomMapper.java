package com.codeforworks.NTH_WorkFinder.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.codeforworks.NTH_WorkFinder.dto.chat.ChatRoomDTO;
import com.codeforworks.NTH_WorkFinder.dto.chat.ChatMessageDTO;
import com.codeforworks.NTH_WorkFinder.model.ChatRoom;
import com.codeforworks.NTH_WorkFinder.model.Message;

@Mapper(componentModel = "spring")
public interface ChatRoomMapper {
    @Mapping(source = "employer.id", target = "employerId")
    @Mapping(source = "employer.companyName", target = "employerName")
    @Mapping(source = "candidate.id", target = "candidateId")
    @Mapping(source = "candidate.user.fullName", target = "candidateName")
    @Mapping(source = "lastMessageTime", target = "lastMessageTime")
    @Mapping(source = "lastMessage", target = "lastMessage")
    ChatRoomDTO toChatRoomDTO(ChatRoom chatRoom);

    @Mapping(source = "chatRoom.roomId", target = "roomId")
    @Mapping(source = "content", target = "content")
    @Mapping(source = "sender.id", target = "senderId")
    @Mapping(source = "createdDate", target = "timestamp")
    @Mapping(source = "type", target = "type")
    ChatMessageDTO toChatMessageDTO(Message message);
} 