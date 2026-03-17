package com.example.demo.scoring;

import java.util.Map;

public class IntegrityNode implements ScoringNode {
    @Override
    public double calculate(Map<String, Double> signals) {
        double emotion = signals.getOrDefault("emotion", 0.0);
        double energy = signals.getOrDefault("energy", 0.0);
        double speechRate = signals.getOrDefault("speechRate", 0.0);
        double straightFace = signals.getOrDefault("straightFace", 0.0);
        
        // (0.25 * v.emotion) + (0.25 * v.energy) + (0.25 * v.speechRate) + (0.25 * v.straightFace)
        double raw = (0.25 * emotion) + (0.25 * energy) + (0.25 * speechRate) + (0.25 * straightFace);
        return 1.0 + (raw * 4.0);
    }

    @Override
    public String getTraitName() {
        return "Integrity";
    }
}
