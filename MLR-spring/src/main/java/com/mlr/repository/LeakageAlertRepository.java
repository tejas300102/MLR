package com.mlr.repository;

import com.mlr.entity.LeakageAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeakageAlertRepository extends JpaRepository<LeakageAlert, Long> {

    List<LeakageAlert> findByUserIdOrderByCreatedAtDesc(String userId);

    boolean existsByUserIdAndRuleNameAndCreatedAtAfter(String userId, String ruleName, LocalDateTime createdAt);

    void deleteByUserId(String userId);


    List<LeakageAlert> findTop5ByOrderByCreatedAtDesc();

    long countByIsReadFalse();


    @Query("SELECT COALESCE(SUM(a.amount), 0) FROM LeakageAlert a")
    double sumTotalLeakageAmount();
}