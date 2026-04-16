const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING },
  video_id: { type: DataTypes.BIGINT },
  videoUrl: { type: DataTypes.TEXT },
  transcription: { type: DataTypes.TEXT },

  // Facial scoring
  eye_contact_score: { type: DataTypes.FLOAT },
  smile_score: { type: DataTypes.FLOAT },
  straight_face_score: { type: DataTypes.FLOAT },
  facial_total: { type: DataTypes.FLOAT },

  // Speech scoring
  emotion_score: { type: DataTypes.FLOAT },
  energy_score: { type: DataTypes.FLOAT },
  filler_word_score: { type: DataTypes.FLOAT },
  pitch_score: { type: DataTypes.FLOAT },
  sentence_structure_score: { type: DataTypes.FLOAT },
  speech_rate_score: { type: DataTypes.FLOAT },
  tone_score: { type: DataTypes.FLOAT },
  speech_total: { type: DataTypes.FLOAT },

  // Total scoring (eval heads)
  authenticity_score: { type: DataTypes.FLOAT },
  clarity_score: { type: DataTypes.FLOAT },
  confidence_score: { type: DataTypes.FLOAT },
  emotional_score: { type: DataTypes.FLOAT },
  eval_total: { type: DataTypes.FLOAT },

  // Calculated PDF Traits (1-5 range)
  teamwork: { type: DataTypes.FLOAT },
  customerFocus: { type: DataTypes.FLOAT },
  integrity: { type: DataTypes.FLOAT },
  innovation: { type: DataTypes.FLOAT },
  quality: { type: DataTypes.FLOAT }
});

module.exports = Candidate;
