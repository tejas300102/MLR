package com.mlr.controller;

import com.mlr.dto.AddMoneyDto;
import com.mlr.dto.PaymentDto;
import com.mlr.dto.TransactionDto;
import com.mlr.dto.WalletBalanceDto;
import com.mlr.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@PreAuthorize("hasRole('USER')")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/balance")
    public ResponseEntity<WalletBalanceDto> getBalance(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(walletService.getBalance(userId));
    }

    @PostMapping("/add-money")
    public ResponseEntity<?> addMoney(@Valid @RequestBody AddMoneyDto addMoneyDto, Authentication authentication) {
        if (addMoneyDto.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Amount must be positive");
        }

        String userId = authentication.getName();
        WalletBalanceDto result = walletService.addMoney(userId, addMoneyDto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@Valid @RequestBody PaymentDto paymentDto, Authentication authentication) {
        if (paymentDto.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Amount must be positive");
        }

        try {
            String userId = authentication.getName();
            WalletBalanceDto result = walletService.pay(userId, paymentDto);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDto>> getTransactions(
            @RequestParam(defaultValue = "10") int limit, 
            Authentication authentication) {
        
        String userId = authentication.getName();
        return ResponseEntity.ok(walletService.getRecentTransactions(userId, limit));
    }
}