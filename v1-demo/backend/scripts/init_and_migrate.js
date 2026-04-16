const { connectDB } = require('../config/db');
const Recruiter = require('../models/recruiter.model');
const Candidate = require('../models/candidate.model');
const { getLegacyCandidates } = require('../utils/sqlParser');
const { calculateTraitScores, calculateCultureFit } = require('../utils/mappingEngine');
const crypto = require('crypto');

const run = async () => {
  try {
    // 1. Force Sync to clean schema
    await connectDB(); 
    console.log('Database synced with force:true (Wipe completed)');

    // 2. Create Default Recruiter
    const recruiter = await Recruiter.create({
      id: crypto.randomUUID(),
      name: 'Primary Recruiter',
      email: 'recruiter@wezume.io',
      password: 'password123',
      cultureBenchmarks: {
        teamwork: 4.0,
        customerFocus: 4.0,
        integrity: 4.5,
        innovation: 3.5,
        quality: 4.0
      }
    });
    console.log(`Recruiter created: ${recruiter.name} (${recruiter.id})`);

    // 3. Deep Scan Join
    console.log('Extracting legacy candidates (Deep Join)...');
    const legacyCandidates = getLegacyCandidates();
    console.log(`Found ${legacyCandidates.length} potential legacy candidates.`);

    // 4. Calculate Max for Normalization
    const maxSignals = {};
    legacyCandidates.forEach(lc => {
      for (const s in lc.signals) {
        if (lc.signals[s] !== null) {
          maxSignals[s] = Math.max(maxSignals[s] || 0, lc.signals[s]);
        }
      }
    });

    let passedCount = 0;
    for (const lc of legacyCandidates) {
      const normalizedSignals = {};
      for (const s in lc.signals) {
        normalizedSignals[s] = lc.signals[s] !== null ? (lc.signals[s] / (maxSignals[s] || 1)) : 0.5;
      }
      
      const traits = calculateTraitScores(normalizedSignals);
      const { fitScore } = calculateCultureFit(traits, recruiter.cultureBenchmarks);

      if (fitScore >= 70) {
        await Candidate.create({
          id: crypto.randomUUID(),
          name: lc.name,
          video_id: lc.legacyId,
          videoUrl: lc.videoUrl,
          transcription: lc.transcription,
          eye_contact_score: lc.signals.vc,
          smile_score: lc.signals.vs,
          straight_face_score: lc.signals.vf,
          facial_total: lc.rawScores.facialTotal,
          emotion_score: lc.signals.vemo,
          energy_score: lc.signals.ve,
          filler_word_score: lc.signals.vfw,
          pitch_score: lc.signals.vp,
          sentence_structure_score: lc.rawScores.sentenceStructure,
          speech_rate_score: lc.signals.vr,
          tone_score: lc.signals.vt,
          speech_total: lc.rawScores.speechTotal,
          authenticity_score: lc.rawScores.authenticity,
          clarity_score: lc.rawScores.clarity,
          confidence_score: lc.rawScores.confidence,
          emotional_score: lc.rawScores.emotional,
          eval_total: lc.rawScores.evalTotal,
          teamwork: traits.teamwork.toFixed(2),
          customerFocus: traits.customerFocus.toFixed(2),
          integrity: traits.integrity.toFixed(2),
          innovation: traits.innovation.toFixed(2),
          quality: traits.quality.toFixed(2)
        });
        passedCount++;
      }
    }

    console.log(`\n--- FINAL COMPLETE MIGRATION ---`);
    console.log(`Total Joined Records: ${legacyCandidates.length}`);
    console.log(`Candidates Successfully Imported: ${passedCount}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
