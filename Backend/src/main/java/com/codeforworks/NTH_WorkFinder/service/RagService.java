package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.model.KnowledgeVector;
import com.codeforworks.NTH_WorkFinder.repository.KnowledgeVectorRepository;
import io.qdrant.client.grpc.Points.ScoredPoint;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagService {

    private final KnowledgeVectorRepository vectorRepository;
    private final QdrantService qdrantService;
    private final GeminiService geminiService;
    private final EmbeddingService embeddingService;

    @SneakyThrows
    public String answerJobQuery(String userQuery) {
        log.info("User query: {}", userQuery);

        float[] queryVector = embeddingService.embed(userQuery);
        if (queryVector == null || queryVector.length == 0) {
            return "Xin lỗi, không thể xử lý câu hỏi này (embedding thất bại).";
        }

        List<ScoredPoint> hits = qdrantService.semanticSearch(queryVector, 10);
        log.info("🔍 Qdrant trả về {} điểm", hits.size());

        List<String> contexts = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (var p : hits) {
            var payloadMap = p.getPayloadMap();
            if (payloadMap == null) continue;

            if (payloadMap.containsKey("expires_at")) {
                try {
                    Object raw = payloadMap.get("expires_at");
                    String rawStr = raw.toString();

                    // Xử lý khi Qdrant trả về kiểu string_value: "2026-02-01 07:00:00.0"
                    if (rawStr.contains("string_value:")) {
                        rawStr = rawStr.replace("string_value:", "").replace("\"", "").trim();
                    }

                    // Lấy 10 ký tự đầu để có yyyy-MM-dd
                    String datePart = rawStr.length() >= 10 ? rawStr.substring(0, 10) : rawStr;
                    LocalDate endDate = LocalDate.parse(datePart);

                    if (endDate.isBefore(today)) continue;
                } catch (Exception e) {
                    log.warn("⚠️ Không parse được expires_at (sau xử lý): {}", payloadMap.get("expires_at"));
                }
            }




            StringBuilder ctx = new StringBuilder();

            Object st = payloadMap.get("source_table");
            Object sid = payloadMap.get("source_id");
            String sourceTable = st != null ? st.toString() : null;
            Long sourceId = null;
            if (sid instanceof Number) sourceId = ((Number) sid).longValue();
            else try { sourceId = Long.parseLong(sid.toString().replaceAll("\\.0$", "")); } catch (Exception ignore) {}

            if (sourceTable != null && sourceId != null) {
                vectorRepository.findBySourceTableAndSourceId(sourceTable, sourceId)
                        .ifPresent(v -> ctx.append(v.getContent()));
            }

            if (ctx.isEmpty()) {
                if (payloadMap.containsKey("title")) ctx.append("Vị trí: ").append(payloadMap.get("title")).append("\n");
                if (payloadMap.containsKey("company")) ctx.append("Công ty: ").append(payloadMap.get("company")).append("\n");
                if (payloadMap.containsKey("salary")) ctx.append("Mức lương: ").append(payloadMap.get("salary")).append("\n");
                if (payloadMap.containsKey("location")) ctx.append("Địa điểm: ").append(payloadMap.get("location")).append("\n");
                if (payloadMap.containsKey("skills")) ctx.append("Kỹ năng: ").append(payloadMap.get("skills")).append("\n");
                if (payloadMap.containsKey("experience")) ctx.append("Kinh nghiệm: ").append(payloadMap.get("experience")).append("\n");
                if (payloadMap.containsKey("industry")) ctx.append("Ngành nghề: ").append(payloadMap.get("industry")).append("\n");
                if (payloadMap.containsKey("expires_at")) ctx.append("Hạn tuyển dụng: ").append(payloadMap.get("expires_at")).append("\n");
                if (payloadMap.containsKey("content")) ctx.append("Mô tả: ").append(payloadMap.get("content")).append("\n");
            }


            if (ctx.length() > 0) contexts.add(ctx.toString().trim());
        }

        if (contexts.isEmpty()) {
            return "Xin lỗi, tôi không tìm thấy thông tin liên quan để trả lời.";
        }

        String prompt = """
    Bạn là trợ lý tuyển dụng Tuyển Dụng PM.
    Người dùng hỏi: "%s"

    Dưới đây là các thông tin liên quan (có thể bao gồm job còn hạn, hướng dẫn tạo CV, hướng dẫn quên mật khẩu, hướng dẫn đăng ký tài khoản, cách chat với nhà tuyển dụng...):
    %s

    Hãy trả lời ngắn gọn, chính xác và chỉ dựa trên thông tin tìm thấy:


    
    QUY TẮC TRẢ LỜI:
    - Nếu là câu hỏi về JOB:
        • Hiển thị: vị trí, công ty, lương, địa điểm, kỹ năng, hạn tuyển dụng
        • Hiển thị tối đa 10 job
        • Có dẫn nguồn (job_id / company)
        

    - Nếu là HƯỚNG DẪN TẠO CV:
        • Liệt kê từng bước rõ ràng
        • Nhấn mạnh các thông tin người dùng cần điền để CV hiển thị đúng

    - Nếu là câu hỏi về QUÊN MẬT KHẨU:
        • Trả lời tổng quát dựa trên nội dung tìm thấy, không sáng tạo thêm chi tiết

    - Nếu là câu hỏi về ĐĂNG KÝ TÀI KHOẢN:
        • Trả lời tổng quát 
        - Không được thêm thông tin ngoài phạm vi

    - Nếu là câu hỏi hỗ trợ khác (ví dụ: cách chat với nhà tuyển dụng):
        • Chỉ trả lời nếu có dữ liệu liên quan trong ngữ cảnh

    

""".formatted(
                userQuery,
                contexts.stream().limit(10).collect(Collectors.joining("\n---\n"))
        );


        return geminiService.askGemini(prompt);
    }
}
//   - Nếu không tìm thấy thông tin phù hợp, trả lời:
//        "Xin lỗi, tôi chỉ có thể trả lời những thông tin về tuyển dụng."
//YÊU CẦU ĐỊNH DẠNG:
//        - Trả lời theo từng ý, ngắt ý xuống dòng rõ ràng.
//        - Mỗi mục phải được cách xuống dòng mới.
//        - Không gộp nhiều thông tin vào cùng một dòng.
//        - Luôn trình bày theo dạng danh sách dễ đọc.