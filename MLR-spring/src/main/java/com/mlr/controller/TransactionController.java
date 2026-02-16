package com.mlr.controller;

import com.mlr.dto.TransactionDto;
import com.mlr.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
@PreAuthorize("hasRole('USER')")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/history")
    public ResponseEntity<List<TransactionDto>> getHistory(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(transactionService.getTransactionHistory(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetails(@PathVariable Long id, Authentication authentication) {
        String userId = authentication.getName();
        TransactionDto transaction = transactionService.getTransactionDetails(userId, id);

        if (transaction == null) {
            return ResponseEntity.status(404).body("Transaction not found");
        }
        return ResponseEntity.ok(transaction);
    }
}