const CandidateService = require('./candidate.service');

exports.submitCandidate = async (req, res) => {
  try {
    const candidate = await CandidateService.createCandidate(req.body);
    res.status(201).json({
      msg: 'Candidate record created and queued for processing',
      id: candidate.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit candidate' });
  }
};

exports.getCandidateDetails = async (req, res) => {
  try {
    const candidate = await CandidateService.getCandidateById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    res.json({
      id: candidate.id,
      name: candidate.name,
      videoUrl: candidate.videoUrl,
      transcription: candidate.transcription,
      cultureFitScore: candidate.cultureFitScore,
      traitBreakdown: candidate.traitBreakdown,
      scores: {
        authenticity: candidate.authenticityScore,
        clarity: candidate.clarityScore,
        confidence: candidate.confidenceScore,
        emotional: candidate.emotionalScore,
        technical: candidate.technicalScore
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch candidate details' });
  }
};
