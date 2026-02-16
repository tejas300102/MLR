//package com.mlr.config;
//
//import com.mlr.entity.Category;
//import com.mlr.entity.User;
//import com.mlr.entity.Wallet;
//import com.mlr.repository.CategoryRepository;
//import com.mlr.repository.UserRepository;
//import com.mlr.repository.WalletRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.util.Arrays;
//
//@Component
//public class DataSeeder implements CommandLineRunner {
//
//    private final CategoryRepository categoryRepository;
//    private final UserRepository userRepository;
//    private final WalletRepository walletRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public DataSeeder(CategoryRepository categoryRepository, 
//                      UserRepository userRepository, 
//                      WalletRepository walletRepository, 
//                      PasswordEncoder passwordEncoder) {
//        this.categoryRepository = categoryRepository;
//        this.userRepository = userRepository;
//        this.walletRepository = walletRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        seedCategories();
//        seedAdminUser();
//    }
//
//    private void seedCategories() {
//        if (categoryRepository.count() == 0) {
//            categoryRepository.saveAll(Arrays.asList(
//                new Category(1, "Food & Dining", "Restaurants, groceries, food delivery"),
//                new Category(2, "Transportation", "Fuel, public transport, taxi, auto"),
//                new Category(3, "Shopping", "Clothing, electronics, online shopping"),
//                new Category(4, "Entertainment", "Movies, games, subscriptions"),
//                new Category(5, "Bills & Utilities", "Electricity, water, internet, phone"),
//                new Category(6, "Healthcare", "Medical expenses, pharmacy, insurance"),
//                new Category(7, "Education", "Fees, books, courses, training"),
//                new Category(8, "Other", "Miscellaneous expenses")
//            ));
//            System.out.println("Categories Seeded");
//        }
//    }
//
//    private void seedAdminUser() {
//        if (!userRepository.existsByEmail("admin@mlr.com")) {
//            User admin = new User();
//            admin.setFirstName("Admin");
//            admin.setLastName("User");
//            admin.setEmail("admin@mlr.com");
//            admin.setPassword(passwordEncoder.encode("Admin@123")); 
//            admin.setRole("ADMIN");
//            admin.setActive(true);
//            
//            User savedAdmin = userRepository.save(admin);
//            
// 
//            walletRepository.save(new Wallet(savedAdmin.getId(), 0.0));
//            
//            System.out.println(" Admin User Seeded (Email: admin@mlr.com, Pass: Admin@123)");
//        }
//    }
//}

package com.mlr.config;

import com.mlr.entity.Category;
import com.mlr.entity.User;
import com.mlr.entity.Wallet;
import com.mlr.repository.CategoryRepository;
import com.mlr.repository.UserRepository;
import com.mlr.repository.WalletRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(CategoryRepository categoryRepository, 
                      UserRepository userRepository, 
                      WalletRepository walletRepository, 
                      PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedAdminUser();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(Arrays.asList(
                new Category(1, "Food & Dining", "Restaurants, groceries, food delivery"),
                new Category(2, "Transportation", "Fuel, public transport, taxi, auto"),
                new Category(3, "Shopping", "Clothing, electronics, online shopping"),
                new Category(4, "Entertainment", "Movies, games, subscriptions"),
                new Category(5, "Bills & Utilities", "Electricity, water, internet, phone"),
                new Category(6, "Healthcare", "Medical expenses, pharmacy, insurance"),
                new Category(7, "Education", "Fees, books, courses, training"),
                new Category(8, "Other", "Miscellaneous expenses")
            ));
            System.out.println("Categories Seeded");
        }
    }

    private void seedAdminUser() {
        Optional<User> existingAdmin = userRepository.findByEmail("admin@mlr.com");
        
        if (existingAdmin.isEmpty()) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@mlr.com");
            admin.setPassword(passwordEncoder.encode("Admin@123")); 
            admin.setRole("ADMIN");
            admin.setActive(true);
            
            User savedAdmin = userRepository.save(admin);
            
            walletRepository.save(new Wallet(savedAdmin.getId(), 0.0));
            
            System.out.println("Admin User Seeded (Email: admin@mlr.com, Pass: Admin@123)");
        } else {
            // FIX: Ensure the existing admin has the correct ROLE
            User admin = existingAdmin.get();
            if (!"ADMIN".equals(admin.getRole())) {
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Updated existing Admin user role to ADMIN");
            }
        }
    }
}