package com.mlr.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mlr.dto.RuleWorkflow; // We will create this DTO later
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

@Configuration
public class RulesConfig {

    private static final Logger logger = LoggerFactory.getLogger(RulesConfig.class);

    @Bean(name = "leakageRules")
    public List<RuleWorkflow> leakageRules(ObjectMapper objectMapper) {
        try {
            
            ClassPathResource resource = new ClassPathResource("rules.json");
            if (!resource.exists()) {
                logger.warn("rules.json not found. initializing with empty rules.");
                return Collections.emptyList();
            }

            InputStream inputStream = resource.getInputStream();
            List<RuleWorkflow> workflows = objectMapper.readValue(inputStream, new TypeReference<List<RuleWorkflow>>() {});
            
            logger.info("Successfully loaded {} rule workflows.", workflows.size());
            return workflows;
        } catch (IOException e) {
            logger.error("Failed to load rules.json", e);
            return Collections.emptyList();
        }
    }
}