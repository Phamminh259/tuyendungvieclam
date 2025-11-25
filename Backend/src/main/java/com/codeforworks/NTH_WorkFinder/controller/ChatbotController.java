package com.codeforworks.NTH_WorkFinder.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.codeforworks.NTH_WorkFinder.dto.chatbot.ChatbotMessageDTO;
import com.codeforworks.NTH_WorkFinder.dto.chatbot.MessageType;
import com.codeforworks.NTH_WorkFinder.service.ChatBotService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor

public class ChatbotController {
    private final ChatBotService chatbotService;
    
    @MessageMapping("/chatbot.message")
    @SendTo("/topic/chatbot")
    public ChatbotMessageDTO handleMessage(@Payload ChatbotMessageDTO message) {
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            return ChatbotMessageDTO.builder()
                    .content("Xin lỗi, tôi không hiểu câu hỏi của bạn")
                    .type(MessageType.BOT)
                    .category("error")
                    .build();
        }
        
        String response = chatbotService.processMessage(message.getContent());
        
        return ChatbotMessageDTO.builder()
                .content(response)
                .type(MessageType.BOT)
                .category(message.getCategory())
                .containsHtml(response.contains("<a href"))
                .build();
    }
}