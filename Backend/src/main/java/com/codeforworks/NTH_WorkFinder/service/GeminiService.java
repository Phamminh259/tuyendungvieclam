package com.codeforworks.NTH_WorkFinder.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GeminiService {

    private final Client client;
    private final String model;

    public GeminiService(
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.model:gemini-1.5-flash}") String model
    ) {
        this.model = model;

        if (apiKey != null && !apiKey.isBlank()) {
            this.client = Client.builder()
                    .apiKey(apiKey)
                    .vertexAI(false) // true nếu muốn dùng Vertex AI GCP
                    .build();
            log.info("Gemini Client created with API key");
        } else {
            this.client = new Client(); // fallback: lấy từ env
            log.info("Gemini Client created from environment variables");
        }
    }

    public String askGemini(String prompt) {
        try {
            GenerateContentResponse response =
                    client.models.generateContent(model, prompt, null);
            String text = response.text();
            return text == null
                    ? "Xin lỗi, không có phản hồi từ Gemini."
                    : text.trim();
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "Xin lỗi, hiện tôi không thể trả lời câu hỏi này.";
        }
    }

    @PreDestroy
    public void close() {
        try {
            client.close();
        } catch (Exception e) {
            log.warn("Error closing Gemini client", e);
        }
    }


}
