package com.example.demo.scoring;

import java.util.Map;

public class TeamworkNode implements ScoringNode {
    @Override
    public double calculate(Map<String, Double> signals) {
        double emotion = signals.getOrDefault("emotion", 0.0);
        double smile = signals.getOrDefault("smile", 0.0);
        double eyeContact = signals.getOrDefault("eyeContact", 0.0);
        double tone = signals.getOrDefault("tone", 0.0);
        double pitch = signals.getOrDefault("pitch", 0.0);
        
        // (0.20 * v.emotion) + (0.20 * v.smile) + (0.10 * v.eyeContact) + (0.25 * v.tone) + (0.25 * v.pitch)
        double raw = (0.20 * emotion) + (0.20 * smile) + (0.10 * eyeContact) + (0.25 * tone) + (0.25 * pitch);
        return 1.0 + (raw * 4.0);
    }

    @Override
    public String getTraitName() {
        return "Teamwork";
    }
}
