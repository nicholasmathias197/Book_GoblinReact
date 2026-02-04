package com.bookgoblin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class OpenLibraryConfig {

    @Value("${openlibrary.api.timeout.connect:5000}")
    private int connectTimeout;

    @Value("${openlibrary.api.timeout.read:10000}")
    private int readTimeout;

    @Bean
    public RestTemplate openLibraryRestTemplate() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeout);
        factory.setConnectionRequestTimeout(connectTimeout);
        factory.setReadTimeout(readTimeout);

        RestTemplate restTemplate = new RestTemplate(factory);

        // Add custom error handler if needed
        return restTemplate;
    }
}