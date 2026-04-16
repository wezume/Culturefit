package com.example.demo.scoring;

import java.util.Map;

public class InnovationNode implements ScoringNode {
    @Override
    public double calculate(Map<String, Double> signals) {
        double energy = signals.getOrDefault("energy", 0.0);
        double pitch = signals.getOrDefault("pitch", 0.0);
        double speechRate = signals.getOrDefault("speechRate", 0.0);
        double emotion = signals.getOrDefault("emotion", 0.0);
        
        // (0.30 * v.energy) + (0.30 * v.pitch) + (0.30 * v.speechRate) + (0.10 * v.emotion)
        double raw = (0.30 * energy) + (0.30 * pitch) + (0.30 * speechRate) + (0.10 * emotion);
        return 1.0 + (raw * 4.0);
    }

    @Override
    public String getTraitName() {
        return "Innovation";
    }
}
