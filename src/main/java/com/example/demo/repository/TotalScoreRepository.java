package com.example.demo.repository;

import com.example.demo.model.TotalScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TotalScoreRepository extends JpaRepository<TotalScore, Long> {
    // Find score by video ID
    Optional<TotalScore> findByVideoId(Long videoId);
}
