package com.mlr.controller;

import com.mlr.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String search) {

        return ResponseEntity.ok(adminService.getAllUsers(search));
    }

    @PostMapping("/users/{userId}/block")
    public ResponseEntity<?> blockUser(@PathVariable String userId) {
        boolean result = adminService.blockUser(userId);
        if (!result) return ResponseEntity.status(404).body("User not found");
        return ResponseEntity.ok(Map.of("message", "User blocked successfully"));
    }

    @PostMapping("/users/{userId}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable String userId) {
        boolean result = adminService.unblockUser(userId);
        if (!result) return ResponseEntity.status(440).body("User not found");
        return ResponseEntity.ok(Map.of("message", "User unblocked successfully"));
    }

    @PostMapping("/users/{userId}/reset-wallet")
    public ResponseEntity<?> resetWallet(@PathVariable String userId) {
        boolean result = adminService.resetWallet(userId);
        if (!result) return ResponseEntity.status(404).body("User wallet not found");
        return ResponseEntity.ok(Map.of("message", "Wallet reset successfully"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getSystemAnalytics() {
        return ResponseEntity.ok(adminService.getSystemAnalytics());
    }

    @GetMapping("/categories")
    @PreAuthorize("permitAll()") 
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(adminService.getCategories());
    }

    @GetMapping("/rules/status")
    public ResponseEntity<?> getRulesStatus() {
        return ResponseEntity.ok(adminService.getRulesStatus());
    }
}