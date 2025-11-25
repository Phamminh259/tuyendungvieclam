package com.codeforworks.NTH_WorkFinder.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
public class Message extends Base {
    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom; // Phòng chat

    @Column(columnDefinition = "TEXT")
    private String content; // Nội dung tin nhắn

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender; // Người gửi

    private boolean isRead = false; // Đã đọc

    @Enumerated(EnumType.STRING)
    private UserType senderType; //  phân biệt người gửi
    
    @Enumerated(EnumType.STRING)
    private MessageType type = MessageType.TEXT; // loại tin nhắn

    public enum UserType {
        EMPLOYER,
        CANDIDATE
    }

    public enum MessageType {
        TEXT, // văn bản
        IMAGE, // hình ảnh
        FILE // tài liệu
    }
} 