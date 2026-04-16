const Recruiter = require('../models/recruiter.model');
const Candidate = require('../models/candidate.model');

class RecruiterService {
  async createRecruiter(recruiterData) {
    return await Recruiter.create(recruiterData);
  }

  async updateBenchmarks(id, benchmarks) {
    return await Recruiter.update(
      { cultureBenchmarks: benchmarks },
      { where: { id } }
    );
  }

  async getRecruiterById(id) {
    return await Recruiter.findByPk(id);
  }

  async getCandidatesByRecruiter(recruiterId) {
    return await Candidate.findAll({
      where: { recruiterId }
    });
  }
}

module.exports = new RecruiterService();
