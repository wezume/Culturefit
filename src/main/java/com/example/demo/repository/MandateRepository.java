package com.example.demo.repository;

import com.example.demo.model.Mandate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MandateRepository extends JpaRepository<Mandate, Integer> {
    Optional<Mandate> findByJobid(String jobid);
    List<Mandate> findByFunctionalArea(String functionalArea);
}
