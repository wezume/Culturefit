package com.example.demo.repository;

import com.example.demo.model.CultureFitScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultureFitScoreRepository extends JpaRepository<CultureFitScore, Integer> {
    
    // Find all scores for a specific candidate
    List<CultureFitScore> findByCandidateId(Integer candidateId);
}
