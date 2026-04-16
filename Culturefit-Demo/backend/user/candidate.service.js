const Candidate = require('../models/candidate.model');
const bcrypt = require('bcryptjs');

class CandidateService {
  async createCandidate(candidateData) {
    const { 
      name, email, password, videoUrl, recruiterId, 
      transcription, authenticityScore, clarityScore, 
      confidenceScore, emotionalScore, technicalScore, 
      cultureFitScore, traitBreakdown, processed 
    } = candidateData;
    
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    
    return await Candidate.create({
      name,
      email,
      password: hashedPassword,
      videoUrl,
      transcription,
      authenticityScore,
      clarityScore,
      confidenceScore,
      emotionalScore,
      technicalScore,
      cultureFitScore,
      traitBreakdown,
      recruiterId,
      processed: processed || false
    });
  }

  async getCandidateById(id) {
    return await Candidate.findByPk(id);
  }

  async getUnprocessedCandidates() {
    return await Candidate.findAll({ where: { processed: false } });
  }

  async updateCandidateResults(id, results) {
    return await Candidate.update(results, { where: { id } });
  }
}

module.exports = new CandidateService();
