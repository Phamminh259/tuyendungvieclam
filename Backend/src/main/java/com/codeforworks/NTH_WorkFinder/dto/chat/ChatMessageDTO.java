package com.codeforworks.NTH_WorkFinder.dto.chat;

import com.codeforworks.NTH_WorkFinder.model.Message;
import com.codeforworks.NTH_WorkFinder.model.Message.UserType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String roomId;
    private String content;
    private Long senderId;
    private UserType senderType; 
    private String senderName; 
    private Date timestamp = new Date();
    private Message.MessageType type = Message.MessageType.TEXT;
    private boolean isRead;
} 