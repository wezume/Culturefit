package com.example.demo.controller;

import com.example.demo.dto.CandidateDTO;
import com.example.demo.model.User;
import com.example.demo.model.TotalScore;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TotalScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CandidateController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TotalScoreRepository totalScoreRepository;

    /**
     * GET /api/candidates - Get all candidates with their scores
     */
    @GetMapping("/candidates")
    @Transactional(readOnly = true)
    public ResponseEntity<List<CandidateDTO>> getAllCandidates() {
        try {
            List<User> users = userRepository.findAll();
            
            // Filter to only include users who have scores (i.e., have videos)
            List<CandidateDTO> candidates = users.stream()
                .map(user -> {
                    // Try to find score for this user (using user ID as video ID)
                    TotalScore score = totalScoreRepository.findByVideoId(user.getId()).orElse(null);
                    
                    if (score != null) {
                        return new CandidateDTO(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getEmail(),
                            user.getCity(),
                            user.getIndustry(),
                            user.getExperience(),
                            user.getKeySkills(),
                            score.getEmotionalScore(),
                            score.getClarityScore(),
                            score.getConfidenceScore(),
                            score.getAuthenticityScore()
                        );
                    } else {
                        return null; // Skip users without scores
                    }
                })
                .filter(candidate -> candidate != null) // Remove null entries
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/candidates/{id} - Get a specific candidate by ID
     */
    @GetMapping("/candidates/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<CandidateDTO> getCandidateById(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            TotalScore score = totalScoreRepository.findByVideoId(user.getId()).orElse(null);
            
            CandidateDTO candidate;
            if (score != null) {
                candidate = new CandidateDTO(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getCity(),
                    user.getIndustry(),
                    user.getExperience(),
                    user.getKeySkills(),
                    score.getEmotionalScore(),
                    score.getClarityScore(),
                    score.getConfidenceScore(),
                    score.getAuthenticityScore()
                );
            } else {
                candidate = new CandidateDTO(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getCity(),
                    user.getIndustry(),
                    user.getExperience(),
                    user.getKeySkills(),
                    5.0, 5.0, 5.0, 5.0
                );
            }
            
            return ResponseEntity.ok(candidate);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
