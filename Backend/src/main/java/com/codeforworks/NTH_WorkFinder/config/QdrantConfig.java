package com.codeforworks.NTH_WorkFinder.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class QdrantConfig {

    @Value("${qdrant.url}")
    private String qdrantUrl;

    @Value("${qdrant.apiKey:}")
    private String qdrantApiKey;

    @Bean
    public WebClient qdrantWebClient() {
        WebClient.Builder b = WebClient.builder().baseUrl(qdrantUrl);
        if (qdrantApiKey != null && !qdrantApiKey.isBlank()) {
            b.defaultHeader("api-key", qdrantApiKey);
        }
        return b.build();
    }
}
