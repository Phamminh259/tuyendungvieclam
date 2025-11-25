package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.model.ChatbotRule;
import com.codeforworks.NTH_WorkFinder.repository.ChatbotRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatBotService {

    private final ChatbotRuleRepository chatbotRuleRepository;
    private final RagService ragService;
    private final GeminiService geminiService;

    public String processMessage(String message) {
        log.info("Processing message: {}", message);

        String normalizedMessage = normalizeMessage(message);

        // 1. Rule-based
        ChatbotRule matchedRule = findBestMatch(normalizedMessage);
        if (matchedRule != null) {
            log.info("Matched rule: {}", matchedRule.getPattern());
            return matchedRule.getResponse();
        }

        // 2. RAG (Job DB + Gemini)
        String ragAnswer = ragService.answerJobQuery(normalizedMessage);
        if (ragAnswer != null && !ragAnswer.isBlank()) {
            log.info("Answered by RAG");
            return ragAnswer;
        }

        // 3. Gemini fallback (chat tự do)
        log.info("Fallback to Gemini");
        return geminiService.askGemini(
                "Người dùng hỏi: " + message +
                        "\nHãy trả lời tự nhiên, lịch sự và hữu ích."
        );
    }

    private String normalizeMessage(String message) {
        return message.toLowerCase()
                .trim()
                .replaceAll("\\s+", " ");
    }

    private ChatbotRule findBestMatch(String message) {
        List<ChatbotRule> rules = chatbotRuleRepository.findAllByOrderByPriorityDesc();
        for (ChatbotRule rule : rules) {
            Pattern pattern = Pattern.compile(rule.getPattern(), Pattern.CASE_INSENSITIVE);
            if (pattern.matcher(message).find()) {
                return rule;
            }
        }
        return null;
    }
}
