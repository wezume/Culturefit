const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Recruiter = sequelize.define('Recruiter', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cultureBenchmarks: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
});

module.exports = Recruiter;
