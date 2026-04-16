package com.example.demo.service;

import com.example.demo.repository.CultureFitScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NormalizationService {
    
    @Autowired
    private EntityManager entityManager;
    
    @Autowired
    private CultureFitScoreRepository cultureFitScoreRepository;
    
    // Cache distribution in memory: ScoreType -> (Value -> CumulativePercentile)
    private final Map<String, TreeMap<Double, Double>> distributionCache = new ConcurrentHashMap<>();
    
    /**
     * Initialize and refresh statistics on service creation
     */
    public NormalizationService() {
        // Statistics will be refreshed after dependencies are injected
    }
    
    /**
     * Refresh statistics for culture fit scores
     */
    public void refreshStatistics() {
        String[] columns = {
            "communication_score", "teamwork_score", "adaptability_score", 
            "values_alignment_score", "overall_score"
        };
        
        refreshStatisticsForTable("culture_fit_scores", columns);
    }
    
    /**
     * Build empirical CDF for given table columns
     */
    private void refreshStatisticsForTable(String tableName, String[] columns) {
        System.out.println("Building empirical CDF for table: " + tableName);
        
        for (String column : columns) {
            try {
                // Get frequency distribution using native query
                String sql = "SELECT " + column + " as val, COUNT(*) as frequency " +
                           "FROM " + tableName + " " +
                           "WHERE " + column + " IS NOT NULL " +
                           "GROUP BY " + column + " " +
                           "ORDER BY " + column + " ASC";
                
                Query query = entityManager.createNativeQuery(sql);
                List<Object[]> results = query.getResultList();
                
                TreeMap<Double, Double> cdf = new TreeMap<>();
                List<Map.Entry<Double, Long>> frequencies = new ArrayList<>();
                long totalCount = 0;
                
                // Collect frequencies
                for (Object[] row : results) {
                    double val = ((Number) row[0]).doubleValue();
                    long freq = ((Number) row[1]).longValue();
                    frequencies.add(Map.entry(val, freq));
                    totalCount += freq;
                }
                
                if (totalCount == 0) continue;
                
                // Calculate cumulative distribution
                long runningSum = 0;
                for (Map.Entry<Double, Long> entry : frequencies) {
                    runningSum += entry.getValue();
                    double percentile = (double) runningSum / totalCount;
                    cdf.put(entry.getKey(), percentile);
                }
                
                distributionCache.put(column, cdf);
                System.out.println("Built CDF for " + column + " (N=" + totalCount + ")");
                
            } catch (Exception e) {
                System.err.println("Error calculating CDF for " + column + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
    
    /**
     * Normalizes a score using Rank-Based Normalization (Percentile).
     * Maps the score to its percentile in the historical distribution.
     * Scale: 0 - 10
     */
    public double normalize(double rawScore, String scoreType) {
        TreeMap<Double, Double> cdf = distributionCache.get(scoreType);
        
        if (cdf == null || cdf.isEmpty()) {
            // Fallback if no data: Try to refresh once, then return raw score
            refreshStatistics();
            cdf = distributionCache.get(scoreType);
            if (cdf == null || cdf.isEmpty()) {
                return rawScore;
            }
        }
        
        // Look up the percentile using floor entry
        Map.Entry<Double, Double> entry = cdf.floorEntry(rawScore);
        
        double percentile;
        if (entry == null) {
            // Score is smaller than any observed historical value
            percentile = 0.0;
        } else {
            percentile = entry.getValue();
        }
        
        // Scale 0.0 - 1.0 to 0 - 10
        return percentile * 10.0;
    }
    
    /**
     * Normalize a score with integer input
     */
    public double normalize(int rawScore, String scoreType) {
        return normalize((double) rawScore, scoreType);
    }
}

