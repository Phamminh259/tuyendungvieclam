package com.codeforworks.NTH_WorkFinder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Slf4j
public class EmbeddingService {

    private final WebClient webClient;
    private final String apiKey;
    private final String model;
    private final ObjectMapper mapper = new ObjectMapper();

    public EmbeddingService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.embedding.model:text-embedding-004}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta") // ✅ đúng version
                .build();
    }

    public float[] embed(String text) {
        try {
            log.info("Embedding text: {}", text);

            // --- BẮT ĐẦU SỬ DỤNG OBJECTMAPPER ĐỂ TẠO BODY CHUẨN XÁC ---

            // 1. Tạo phần tử "text": "..."
            ObjectNode textPart = mapper.createObjectNode();
            textPart.put("text", text);

            // 2. Tạo mảng "parts": [...]
            ArrayNode partsArray = mapper.createArrayNode();
            partsArray.add(textPart);

            // 3. Tạo đối tượng "content": { "parts": [...] }
            ObjectNode contentObject = mapper.createObjectNode();
            contentObject.set("parts", partsArray);

            // 4. Tạo root node: { "content": { ... } }
            ObjectNode rootNode = mapper.createObjectNode();
            rootNode.set("content", contentObject);

            // Chuyển ObjectNode thành chuỗi JSON
            String body = mapper.writeValueAsString(rootNode);
            // body sẽ là: {"content":{"parts":[{"text":"Nội dung của bạn"}]}}

            log.debug("Generated JSON Body: {}", body);
            // --- KẾT THÚC TẠO BODY ---

            String resp = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            // Endpoint đã đúng: :embedContent
                            .path("/models/" + model + ":embedContent")
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.debug("Raw embedding response: {}", resp);

            // API trả về 'embedding' nằm trong mảng 'embeddings'
            JsonNode root = mapper.readTree(resp);

            // Trích xuất vector: SỬA LẠI ĐƯỜNG DẪN DỰA TRÊN RESPONSE THỰC TẾ
            // Phản hồi có cấu trúc: {"embedding": {"values": [...]}}
            JsonNode values = root.path("embedding").path("values");

            if (!values.isArray() || values.size() == 0) {
                log.error("Embedding FAIL - invalid response structure: {}", resp);
                return new float[0];
            }

            float[] arr = new float[values.size()];
            for (int i = 0; i < values.size(); i++) arr[i] = (float) values.get(i).asDouble();
            return arr;

        } catch (Exception e) {
            log.error("Embedding error", e);
            return new float[0];
        }
    }

    private String escapeJson(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");
    }
}
