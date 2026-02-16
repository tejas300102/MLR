package com.mlr.service;

import com.mlr.dto.LeakageContext;
import com.mlr.dto.RuleWorkflow;
import com.mlr.entity.LeakageAlert;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RuleExecutor {

    private final List<RuleWorkflow> workflows;
    private final ExpressionParser parser;

    public RuleExecutor(List<RuleWorkflow> workflows) {
        this.workflows = workflows;
        this.parser = new SpelExpressionParser();
    }

    public List<LeakageAlert> executeRules(LeakageContext context) {
        List<LeakageAlert> alerts = new ArrayList<>();
        
        ContextWrapper wrapper = new ContextWrapper(context);
        StandardEvaluationContext evalContext = new StandardEvaluationContext(wrapper);

        for (RuleWorkflow workflow : workflows) {
            for (RuleWorkflow.Rule rule : workflow.getRules()) {
                try {
                   
                    Boolean result = parser.parseExpression(rule.getExpression()).getValue(evalContext, Boolean.class);

                    if (Boolean.TRUE.equals(result)) {
                        LeakageAlert alert = new LeakageAlert();
                        alert.setUserId(context.getUserId());
                        alert.setRuleName(rule.getRuleName());
                        alert.setMessage(rule.getSuccessEvent());
                        alert.setSeverity(getSeverityInt(rule.getRuleName()));
                        
                     
                        alert.setAmount(getLeakageAmount(rule.getRuleName(), context));
                        
                        alert.setCreatedAt(LocalDateTime.now());
                        
                        alerts.add(alert);
                    }
                } catch (Exception e) {
                    System.err.println("Rule execution failed [" + rule.getRuleName() + "]: " + e.getMessage());
                }
            }
        }
        return alerts;
    }

    public static class ContextWrapper {
        private final LeakageContext input;

        public ContextWrapper(LeakageContext input) {
            this.input = input;
        }

        public LeakageContext getInput() {
            return input;
        }
    }

    private int getSeverityInt(String ruleName) {
        String name = ruleName.toLowerCase();
        if (name.contains("overspending") || name.contains("entertainment")) return 2; // High
        if (name.contains("duplicate") || name.contains("irregular")) return 1; // Medium
        return 0; // Low
    }

    private Double getLeakageAmount(String ruleName, LeakageContext context) {
        String name = ruleName.toLowerCase();
        

        if (name.contains("category") || name.contains("entertainment")) {
            return context.getEntertainmentSpent();
        }
        

        if (name.contains("overspending")) {
            double excess = context.getTotalSpentLast30Days() - context.getTotalSpentPrevious30Days();
            return excess > 0 ? excess : 0.0;
        }
        

        if (name.contains("duplicate") || name.contains("irregular")) {
            return context.getAvgDebit();
        }
        
        return 0.0;
    }
}