package com.example.demo.scoring;

import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScoringEngine {

    private final List<ScoringNode> nodes = new ArrayList<>();

    @PostConstruct
    public void init() {
        nodes.add(new TeamworkNode());
        nodes.add(new CustomerExcellenceNode());
        nodes.add(new IntegrityNode());
        nodes.add(new InnovationNode());
        nodes.add(new QualityNode());
    }

    /**
     * Calculate all cultural scores for a given set of input signals
     * @param signals Map of signal name to normalized value (0.0-1.0)
     * @return Map of trait names to calculated scores (1.0-5.0)
     */
    public Map<String, Double> calculateAll(Map<String, Double> signals) {
        Map<String, Double> results = new HashMap<>();
        for (ScoringNode node : nodes) {
            results.put(node.getTraitName(), node.calculate(signals));
        }
        return results;
    }
}
