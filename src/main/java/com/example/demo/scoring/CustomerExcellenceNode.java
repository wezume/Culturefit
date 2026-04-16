package com.example.demo.scoring;

import java.util.Map;

public class CustomerExcellenceNode implements ScoringNode {
    @Override
    public double calculate(Map<String, Double> signals) {
        double emotion = signals.getOrDefault("emotion", 0.0);
        double smile = signals.getOrDefault("smile", 0.0);
        double tone = signals.getOrDefault("tone", 0.0);
        double speechRate = signals.getOrDefault("speechRate", 0.0);
        double eyeContact = signals.getOrDefault("eyeContact", 0.0);
        
        // SteadyRate(val) = 1 − |val − 0.5| × 2
        double steadyRate = 1.0 - (Math.abs(speechRate - 0.5) * 2.0);
        
        // (0.25 * v.emotion) + (0.25 * v.smile) + (0.20 * v.tone) + (0.20 * SteadyRate(vr)) + (0.10 * v.eyeContact)
        double raw = (0.25 * emotion) + (0.25 * smile) + (0.20 * tone) + (0.20 * steadyRate) + (0.10 * eyeContact);
        return 1.0 + (raw * 4.0);
    }

    @Override
    public String getTraitName() {
        return "Excellence";
    }
}
