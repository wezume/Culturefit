package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final List<String> VALID_ROLES = List.of("candidate", "recruiter");

    /**
     * POST /api/auth/signup
     * Body: { "email": "...", "role": "candidate"|"recruiter" }
     * Returns: { "token": "<base64>" }
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String role = body.get("role");

        // Validate
        if (email == null || email.isBlank() || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("error", "invalid email"));
        }
        if (role == null || !VALID_ROLES.contains(role)) {
            return ResponseEntity.badRequest().body(Map.of("error", "role must be candidate or recruiter"));
        }

        // Generate token: base64(email:role)  — same logic as TypeScript version
        String raw = email + ":" + role;
        String token = Base64.getEncoder().encodeToString(raw.getBytes());

        return ResponseEntity.ok(Map.of("token", token));
    }
}
