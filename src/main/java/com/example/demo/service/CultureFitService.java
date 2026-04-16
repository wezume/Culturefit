package com.example.demo.service;

import com.example.demo.model.CultureFitScore;
import com.example.demo.repository.CultureFitScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CultureFitService {
    
    @Autowired
    private CultureFitScoreRepository repository;
    
    @Autowired
    private NormalizationService normalizationService;
    
    /**
     * Apply normalization to all score fields
     */
    private CultureFitScore applyNormalization(CultureFitScore score) {
        if (score == null) return null;
        
        score.setNormalizedCommunicationScore(
            normalizationService.normalize(score.getCommunicationScore(), "communication_score"));
        score.setNormalizedTeamworkScore(
            normalizationService.normalize(score.getTeamworkScore(), "teamwork_score"));
        score.setNormalizedAdaptabilityScore(
            normalizationService.normalize(score.getAdaptabilityScore(), "adaptability_score"));
        score.setNormalizedValuesAlignmentScore(
            normalizationService.normalize(score.getValuesAlignmentScore(), "values_alignment_score"));
        score.setNormalizedOverallScore(
            normalizationService.normalize(score.getOverallScore(), "overall_score"));
        
        return score;
    }
    
    /**
     * Submit a new culture fit evaluation
     */
    public CultureFitScore submitEvaluation(Integer candidateId, String evaluatorName,
                                           Integer commScore, Integer teamScore,
                                           Integer adaptScore, Integer valuesScore,
                                           String feedback) {
        // Validation Logic (Business Rule: Scores must be 1-10)
        validateScore(commScore, "Communication");
        validateScore(teamScore, "Teamwork");
        validateScore(adaptScore, "Adaptability");
        validateScore(valuesScore, "Values Alignment");
        
        // Calculate decision logic based on average
        double avg = (commScore + teamScore + adaptScore + valuesScore) / 4.0;
        String decision = "HOLD"; // Default
        if (avg >= 7.0) {
            decision = "PASS";
        } else if (avg < 5.0) {
            decision = "REJECT";
        }
        
        CultureFitScore score = new CultureFitScore(
            candidateId, evaluatorName, commScore, teamScore, 
            adaptScore, valuesScore, feedback, decision);
        
        // Persist
        return repository.save(score);
    }
    
    /**
     * Get a single score by ID with normalization
     */
    public Optional<CultureFitScore> getScore(Integer id) {
        Optional<CultureFitScore> scoreOpt = repository.findById(id);
        scoreOpt.ifPresent(this::applyNormalization);
        return scoreOpt;
    }
    
    /**
     * Get all scores for a specific candidate with normalization
     */
    public List<CultureFitScore> getScoresByCandidateId(Integer candidateId) {
        List<CultureFitScore> scores = repository.findByCandidateId(candidateId);
        scores.forEach(this::applyNormalization);
        return scores;
    }
    
    /**
     * Get all scores with normalization
     */
    public List<CultureFitScore> getAllScores() {
        List<CultureFitScore> scores = repository.findAll();
        scores.forEach(this::applyNormalization);
        return scores;
    }
    
    /**
     * Validate that score is in valid range 1-10
     */
    private void validateScore(Integer score, String fieldName) {
        if (score == null || score < 1 || score > 10) {
            throw new IllegalArgumentException(fieldName + " score must be between 1 and 10.");
        }
    }
}
