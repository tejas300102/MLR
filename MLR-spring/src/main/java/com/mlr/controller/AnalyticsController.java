package com.mlr.controller;

import com.mlr.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('USER')")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/spending")
    public ResponseEntity<?> getSpendingAnalytics(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(analyticsService.getSpendingAnalytics(userId));
    }

    @GetMapping("/leakage-alerts")
    public ResponseEntity<?> getLeakageAlerts(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(analyticsService.getLeakageAlerts(userId));
    }

    @PostMapping("/leakage-alerts/{id}/read")
    public ResponseEntity<?> markAlertAsRead(@PathVariable Long id, Authentication authentication) {
        String userId = authentication.getName();
        boolean result = analyticsService.markAlertAsRead(userId, id);

        if (!result) {
            return ResponseEntity.status(404).body(Map.of("message", "Alert not found or access denied"));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Alert marked as read"));
    }

    @GetMapping("/leakage")
    public ResponseEntity<?> getLeakageAnalytics(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(analyticsService.getLeakageAnalytics(userId));
    }
}