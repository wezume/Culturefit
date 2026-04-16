package com.example.demo.repository;

import com.example.demo.model.ScoreStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScoreStatisticsRepository extends JpaRepository<ScoreStatistics, String> {
    
    // Find statistics by score type
    Optional<ScoreStatistics> findByScoreType(String scoreType);
}
