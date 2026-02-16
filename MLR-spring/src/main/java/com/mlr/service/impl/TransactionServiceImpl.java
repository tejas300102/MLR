package com.mlr.service.impl;

import com.mlr.dto.TransactionDto;
import com.mlr.entity.Transaction;
import com.mlr.repository.TransactionRepository;
import com.mlr.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired private TransactionRepository transactionRepository;

    @Override
    public List<TransactionDto> getTransactionHistory(String userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public TransactionDto getTransactionDetails(String userId, Long transactionId) {

        return transactionRepository.findById(transactionId)
                .filter(t -> t.getUserId().equals(userId))
                .map(this::mapToDto)
                .orElse(null);
    }

    private TransactionDto mapToDto(Transaction t) {
        TransactionDto dto = new TransactionDto();
        dto.setId(t.getId());
        dto.setAmount(t.getAmount());
        dto.setType(t.getType() == 0 ? "CREDIT" : "DEBIT");
        dto.setDescription(t.getDescription());
        dto.setCategoryName(t.getCategory() != null ? t.getCategory().getName() : "Unknown");
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}