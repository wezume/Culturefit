package com.example.demo.scoring;

import java.util.Map;

public class QualityNode implements ScoringNode {
    @Override
    public double calculate(Map<String, Double> signals) {
        double tone = signals.getOrDefault("tone", 0.0);
        double pitch = signals.getOrDefault("pitch", 0.0);
        double straightFace = signals.getOrDefault("straightFace", 0.0);
        double eyeContact = signals.getOrDefault("eyeContact", 0.0);
        double fillerWords = signals.getOrDefault("fillerWords", 0.0);
        double energy = signals.getOrDefault("energy", 0.0);
        
        // (0.25 * v.tone) + (0.25 * v.pitch) + (0.15 * v.straightFace) + (0.15 * v.eyeContact) + (0.15 * v.fillerWords) + (0.05 * v.energy)
        double raw = (0.25 * tone) + (0.25 * pitch) + (0.15 * straightFace) + (0.15 * eyeContact) + (0.15 * fillerWords) + (0.05 * energy);
        return 1.0 + (raw * 4.0);
    }

    @Override
    public String getTraitName() {
        return "Quality";
    }
}
