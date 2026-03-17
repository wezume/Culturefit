package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find all users
    List<User> findAll();
    
    // Custom query to get users with their video IDs
    @Query("SELECT u FROM User u")
    List<User> findAllUsers();
}
