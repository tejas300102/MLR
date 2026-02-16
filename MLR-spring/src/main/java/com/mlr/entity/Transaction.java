package com.mlr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter @Setter @NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    private Double amount;

    // 0 = Credit, 1 = Debit
    private int type;

    // 0=Salary, 1=Cash, 2=Refund, 3=Payment
    private int source;

    private String description;

    private String merchant;

    private String upiId; 

    @Column(name = "category_id")
    private Integer categoryId;

    private LocalDateTime createdAt = LocalDateTime.now();

 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER) // Eager load category name for history
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;
}