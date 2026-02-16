package com.mlr.repository;

import com.mlr.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);


    @Query("SELECT u FROM User u WHERE " +
           "(u.role IS NULL OR LOWER(u.role) <> 'admin') " +
           "AND LOWER(u.email) <> 'admin@mlr.com'")
    List<User> findAllNonAdminUsers();


    @Query("SELECT COUNT(u) FROM User u WHERE " +
           "(u.role IS NULL OR LOWER(u.role) <> 'admin') " +
           "AND LOWER(u.email) <> 'admin@mlr.com'")
    long countNonAdminUsers();
}