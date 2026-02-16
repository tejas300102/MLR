package com.mlr.repository;

import com.mlr.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {


    List<Transaction> findByUserIdOrderByCreatedAtDesc(String userId);


    List<Transaction> findByUserIdAndCreatedAtAfter(String userId, LocalDateTime date);

    void deleteByUserId(String userId);
}