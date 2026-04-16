/**
 * Signal-to-Trait Logic (Scoring Algorithm)
 * Based on the provided PDF documentation.
 */

const calculateTraitScores = (signals) => {
  const {
    vemo = 0.5, // Emotion
    ve = 0.5,   // Energy
    vfw = 0.5,  // Filler Words
    vp = 0.5,   // Pitch
    vr = 0.5,   // Speech Rate
    vt = 0.5,   // Tone
    vc = 0.5,   // Eye Contact
    vs = 0.5,   // Smile
    vf = 0.5    // Straight Face
  } = signals;

  const steadyRate = (val) => 1 - Math.abs(val - 0.5) * 2;

  // Cultural Heads (H_raw: 0.0 - 1.0)
  const hTeam = (0.25 * vemo) + (0.25 * vs) + (0.20 * vc) + (0.20 * vt) + (0.10 * vp);
  const hCust = (0.25 * vemo) + (0.25 * vs) + (0.20 * vt) + (0.20 * steadyRate(vr)) + (0.10 * vc);
  const hInteg = (0.30 * vc) + (0.25 * vf) + (0.25 * vfw) + (0.20 * vt);
  const hInn = (0.30 * ve) + (0.25 * vp) + (0.25 * vr) + (0.20 * vemo);
  const hQual = (0.35 * vt) + (0.25 * vfw) + (0.20 * vc) + (0.10 * vf) + (0.10 * vp);

  // Scaling to 1-5
  const scale = (h) => parseFloat((1 + (h * 4)).toFixed(2));

  return {
    teamwork: scale(hTeam),
    customerFocus: scale(hCust),
    integrity: scale(hInteg),
    innovation: scale(hInn),
    quality: scale(hQual)
  };
};

/**
 * Object Mapping Engine
 * Fits candidate traits against recruiter benchmarks.
 */
const calculateCultureFit = (candidateTraits, cultureBenchmarks) => {
  if (!cultureBenchmarks || Object.keys(cultureBenchmarks).length === 0) {
    return { fitScore: 0, mappedBreakdown: {} };
  }

  const mappedBreakdown = {};
  let totalMappedScore = 0;
  let traitCount = 0;

  for (const trait in cultureBenchmarks) {
    const targetScore = cultureBenchmarks[trait];
    const candidateScore = candidateTraits[trait] || 0;

    // score = (candidate_trait / recruiter_benchmark) * 100
    let traitFit = (candidateScore / targetScore) * 100;
    
    if (isNaN(traitFit) || traitFit < 0) traitFit = 0;
    
    mappedBreakdown[trait] = parseFloat(traitFit.toFixed(2));
    totalMappedScore += traitFit;
    traitCount++;
  }

  const averageFitScore = traitCount > 0 ? (totalMappedScore / traitCount) : 0;

  return {
    fitScore: parseFloat(averageFitScore.toFixed(2)),
    mappedBreakdown
  };
};

module.exports = { calculateTraitScores, calculateCultureFit };
