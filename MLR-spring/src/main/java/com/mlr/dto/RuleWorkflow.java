package com.mlr.dto;

import lombok.Data;
import java.util.List;

@Data
public class RuleWorkflow {
    private String workflowName;
    private List<Rule> rules;

    @Data
    public static class Rule {
        private String ruleName;
        private String successEvent;
        private String errorMessage;
        private String expression;
    }
}