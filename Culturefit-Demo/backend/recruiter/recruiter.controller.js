const RecruiterService = require('./recruiter.service');
const CandidateService = require('../user/candidate.service');
const { getLegacyCandidates } = require('../utils/sqlParser');
const { calculateTraitScores, calculateCultureFit } = require('../utils/mappingEngine');

exports.createRecruiter = async (req, res) => {
  try {
    const recruiter = await RecruiterService.createRecruiter(req.body);
    res.status(201).json(recruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create recruiter' });
  }
};

exports.updateBenchmarks = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    await RecruiterService.updateBenchmarks(id, req.body.cultureBenchmarks);
    res.json({ msg: 'Benchmarks updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update benchmarks' });
  }
};

exports.getRecruiterCandidates = async (req, res) => {
  try {
    const candidates = await RecruiterService.getCandidatesByRecruiter(req.params.recruiterId);
    const formatted = candidates.map(c => ({
      id: c.id,
      name: c.name,
      videoUrl: c.videoUrl,
      cultureFitScore: c.cultureFitScore,
      traitBreakdown: c.traitBreakdown,
      scores: {
        authenticity: c.authenticityScore,
        clarity: c.clarityScore,
        confidence: c.confidenceScore,
        emotional: c.emotionalScore,
        technical: c.technicalScore
      }
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recruiter candidates' });
  }
};

/**
 * Preview legacy candidates with a 70% cutoff.
 */
exports.previewCandidates = async (req, res) => {
  const { recruiterId } = req.params;
  try {
    const recruiter = await RecruiterService.getRecruiterById(recruiterId);
    if (!recruiter) return res.status(404).json({ error: 'Recruiter not found' });

    const legacyCandidates = getLegacyCandidates(20); // Fetch up to 20 from SQL
    const results = legacyCandidates.map(lc => {
      // 1. Mock signals for the algorithm
      const signals = {
        vemo: Math.random(), vs: Math.random(), vc: Math.random(), 
        vt: Math.random(), vp: Math.random(), vr: Math.random(),
        vf: Math.random(), vfw: Math.random(), ve: Math.random()
      };

      // 2. Calculate traits using PDF formula
      const traits = calculateTraitScores(signals);

      // 3. Calculate fit mapping
      const { fitScore, mappedBreakdown } = calculateCultureFit(traits, recruiter.cultureBenchmarks);

      return {
        ...lc,
        traits,
        mappedBreakdown,
        fitScore
      };
    });

    // 4. Apply 70% cutoff
    const filtered = results.filter(c => c.fitScore >= 70);

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to preview candidates' });
  }
};

/**
 * Lock candidates and store them in the database.
 */
exports.lockCandidates = async (req, res) => {
  const { recruiterId } = req.params;
  const { selectedCandidates } = req.body; 

  try {
    for (const cData of selectedCandidates) {
      // Ensure email exists (legacy data might lack it)
      const mockEmail = cData.email || `${cData.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}@legacy.com`;
      
      await CandidateService.createCandidate({
        ...cData,
        email: mockEmail,
        password: 'imported-legacy-candi',
        recruiterId,
        cultureFitScore: cData.fitScore,
        traitBreakdown: cData.traitBreakdown,
        processed: true
      });
    }

    res.json({ msg: `${selectedCandidates.length} candidates locked and stored successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to lock candidates' });
  }
};
