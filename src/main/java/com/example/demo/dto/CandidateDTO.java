package com.example.demo.dto;

public class CandidateDTO {
    private Long id;
    private String name;
    private String email;
    private String city;
    private String industry;
    private String experience;
    private String keySkills;
    
    // Input values for cultural score calculation
    private InputValues inputValues;

    public CandidateDTO() {}

    public CandidateDTO(Long id, String firstName, String lastName, String email, 
                       String city, String industry, String experience, String keySkills,
                       Double emotional, Double clarity, Double confidence, Double authenticity) {
        this.id = id;
        this.name = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
        this.email = email;
        this.city = city;
        this.industry = industry;
        this.experience = experience;
        this.keySkills = keySkills;
        
        // Calculate input values from scored metrics
        // Normalize scores from 0-10 range to 0-1 range for frontend
        this.inputValues = new InputValues(
            normalize(emotional),      // emotion
            normalize(emotional * 0.9), // smile (derived from emotional)
            normalize(confidence),      // eyeContact (derived from confidence)
            normalize(authenticity),    // tone (derived from authenticity)
            normalize(clarity),         // pitch (derived from clarity)
            normalize(confidence * 0.95), // energy (derived from confidence)
            normalize(clarity * 0.9),   // speechRate (derived from clarity)
            normalize(authenticity * 0.8), // straightFace (derived from authenticity)
            normalize(clarity * 0.85)   // fillerWords (derived from clarity)
        );
    }

    private double normalize(Double score) {
        if (score == null) return 0.5;
        // Convert score from 0-10 range to 0-1 range
        return Math.min(1.0, Math.max(0.0, score / 10.0));
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getKeySkills() { return keySkills; }
    public void setKeySkills(String keySkills) { this.keySkills = keySkills; }

    public InputValues getInputValues() { return inputValues; }
    public void setInputValues(InputValues inputValues) { this.inputValues = inputValues; }

    // Inner class for input values
    public static class InputValues {
        private double emotion;
        private double smile;
        private double eyeContact;
        private double tone;
        private double pitch;
        private double energy;
        private double speechRate;
        private double straightFace;
        private double fillerWords;

        public InputValues(double emotion, double smile, double eyeContact, double tone, double pitch,
                          double energy, double speechRate, double straightFace, double fillerWords) {
            this.emotion = emotion;
            this.smile = smile;
            this.eyeContact = eyeContact;
            this.tone = tone;
            this.pitch = pitch;
            this.energy = energy;
            this.speechRate = speechRate;
            this.straightFace = straightFace;
            this.fillerWords = fillerWords;
        }

        // Getters and setters
        public double getEmotion() { return emotion; }
        public void setEmotion(double emotion) { this.emotion = emotion; }

        public double getSmile() { return smile; }
        public void setSmile(double smile) { this.smile = smile; }

        public double getEyeContact() { return eyeContact; }
        public void setEyeContact(double eyeContact) { this.eyeContact = eyeContact; }

        public double getTone() { return tone; }
        public void setTone(double tone) { this.tone = tone; }

        public double getPitch() { return pitch; }
        public void setPitch(double pitch) { this.pitch = pitch; }

        public double getEnergy() { return energy; }
        public void setEnergy(double energy) { this.energy = energy; }

        public double getSpeechRate() { return speechRate; }
        public void setSpeechRate(double speechRate) { this.speechRate = speechRate; }

        public double getStraightFace() { return straightFace; }
        public void setStraightFace(double straightFace) { this.straightFace = straightFace; }

        public double getFillerWords() { return fillerWords; }
        public void setFillerWords(double fillerWords) { this.fillerWords = fillerWords; }
    }
}
