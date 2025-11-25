package com.codeforworks.NTH_WorkFinder.model;

import com.codeforworks.NTH_WorkFinder.model.Message;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor
public class ChatRoom extends Base {
    @ManyToOne
    @JoinColumn(name = "employer_id")
    private Employer employer; // Người gửi

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate; // Người nhận

    @Column(unique = true)
    private String roomId; // Unique ID cho phòng chat

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>(); // Tin nhắn trong phòng chat

    @Column
    private Date lastMessageTime; // Thời gian tin nhắn cuối cùng

    @Column
    private String lastMessage; // Nội dung tin nhắn cuối cùng
} 