package com.codeforworks.NTH_WorkFinder.dto.chat;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDTO {
    private String roomId;
    private Long employerId;
    private String employerName;
    private Long candidateId;
    private String candidateName;
    private Date lastMessageTime;
    private String lastMessage;
} 