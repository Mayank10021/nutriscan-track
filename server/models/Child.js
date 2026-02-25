const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  bmi: Number,
  bmiCategory: String,
  district: String,
  state: String,
  region: String,
  calories: Number,
  protein: Number,
  fat: Number,
  carbs: Number,
  incomeGroup: String,
  vaccinationStatus: String,
  stuntingStatus: String,
  wastingStatus: String,
  riskLevel: String,
  riskScore: Number,
  healthWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  followUpDate: Date
});

module.exports = mongoose.model('Child', childSchema);
