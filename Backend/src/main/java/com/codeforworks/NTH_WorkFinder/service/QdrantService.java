package com.codeforworks.NTH_WorkFinder.service;

import io.qdrant.client.QdrantClient;
import io.qdrant.client.QdrantGrpcClient;
import io.qdrant.client.grpc.Points;
import io.qdrant.client.grpc.Points.QueryPoints;
import io.qdrant.client.grpc.Points.PrefetchQuery;
import io.qdrant.client.grpc.Points.Fusion;
import io.qdrant.client.grpc.Points.ScoredPoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

import static io.qdrant.client.QueryFactory.nearest;
import static io.qdrant.client.QueryFactory.fusion;

@Service
@Slf4j
public class QdrantService {

    private final QdrantClient client;
    private final String collection;

    public QdrantService(
            @Value("${qdrant.url}") String url,
            @Value("${qdrant.port}") int port,
            @Value("${qdrant.api.key:}") String apiKey, // : nghĩa là optional nếu để trống
            @Value("${qdrant.collection}") String collection
    ) {
        this.collection = collection;

        QdrantGrpcClient.Builder builder = QdrantGrpcClient.newBuilder(url, port, false);

        if (apiKey != null && !apiKey.isBlank()) {
            builder = builder.withApiKey(apiKey);
        }

        this.client = new QdrantClient(builder.build());
        log.info("Qdrant connected to {}:{}", url, port);
    }
    /**
     * Tìm kiếm vector gần nhất (returns list of ScoredPoint).
     * Lưu ý: điểm khi upsert vào Qdrant cần có payload chứa source_table & source_id.
     */
    public List<Points.ScoredPoint> semanticSearch(float[] queryVector, int limit)
            throws ExecutionException, InterruptedException {

//        QueryPoints queryPoints = QueryPoints.newBuilder()
//                .setCollectionName(collection)
//                .addPrefetch(
//                        Points.PrefetchQuery.newBuilder()
//                                .setQuery(nearest(queryVector))
//                                .setUsing("vectors_dbtd") // 👈 đây là tên vector trong collection
//                                .setLimit(limit)
//                                .build()
//                )
//                .setQuery(fusion(Points.Fusion.RRF)) // RRF = Reciprocal Rank Fusion (hợp nhất kết quả)
//                .build();
        QueryPoints queryPoints = QueryPoints.newBuilder()
                .setCollectionName(collection)
                .setLimit(limit)
                .setWithPayload(
                        Points.WithPayloadSelector.newBuilder()
                                .setEnable(true)
                                .build()
                )
                .setQuery(nearest(queryVector)) // dùng vector mặc định "default"
                .build();

        return client.queryAsync(queryPoints).get();
    }

    public QdrantClient getClient() {
        return client;
    }

    public String getCollection() {
        return collection;
    }




}
