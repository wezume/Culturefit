const cron = require('node-cron');
const CandidateService = require('../user/candidate.service');
const RecruiterService = require('../recruiter/recruiter.service');
const { calculateCultureFit } = require('../utils/mappingEngine');

const processPendingCandidates = async () => {
  console.log('Background Worker: Checking for unprocessed candidates...');
  try {
    const candidates = await CandidateService.getUnprocessedCandidates();
    
    for (const candidate of candidates) {
      console.log(`Processing candidate: ${candidate.name} (${candidate.id})`);

      // 1. Fetch recruiter.cultureBenchmarks
      const recruiter = await RecruiterService.getRecruiterById(candidate.recruiterId);
      if (!recruiter) {
        console.error(`Recruiter ${candidate.recruiterId} not found for candidate ${candidate.id}`);
        continue;
      }

      // 2. Extract traits from transcription (Simulated AI Output)
      // In a real system, this would call an LLM or Transcription API.
      const simulatedTraitBreakdown = {
        communication: Math.floor(Math.random() * 5) + 1,
        teamwork: Math.floor(Math.random() * 5) + 1,
        leadership: Math.floor(Math.random() * 5) + 1,
        adaptability: Math.floor(Math.random() * 5) + 1,
        ownership: Math.floor(Math.random() * 5) + 1
      };

      // 3. Perform Object Mapping & Compute cultureFitScore
      const { fitScore, mappedBreakdown } = calculateCultureFit(
        simulatedTraitBreakdown,
        recruiter.cultureBenchmarks
      );

      // 4. Generate other individual scores (Simulated)
      const authenticityScore = (Math.random() * 5 + 5).toFixed(1); // 5-10
      const clarityScore = (Math.random() * 5 + 5).toFixed(1);
      const confidenceScore = (Math.random() * 5 + 5).toFixed(1);
      const emotionalScore = (Math.random() * 5 + 5).toFixed(1);
      const technicalScore = (Math.random() * 100).toFixed(1);

      // 5. Store results
      await CandidateService.updateCandidateResults(candidate.id, {
        transcription: "This is a simulated AI transcription of the candidate's video response...",
        authenticityScore,
        clarityScore,
        confidenceScore,
        emotionalScore,
        technicalScore,
        cultureFitScore: fitScore,
        traitBreakdown: mappedBreakdown, 
        processed: true
      });

      console.log(`Candidate ${candidate.id} processed successfully. Fit Score: ${fitScore}%`);
    }
  } catch (error) {
    console.error('Error in background worker:', error);
  }
};

// Run periodically (e.g., every 1 minute for the demo)
cron.schedule('* * * * *', processPendingCandidates);

module.exports = { processPendingCandidates };
