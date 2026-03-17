package com.example.demo.scoring;

import java.util.Map;

public interface ScoringNode {
    /**
     * Calculate score based on input signals
     * @param signals Map of signal name to normalized value (0.0-1.0)
     * @return Calculated trait score (1.0-5.0)
     */
    double calculate(Map<String, Double> signals);
    
    String getTraitName();
}
