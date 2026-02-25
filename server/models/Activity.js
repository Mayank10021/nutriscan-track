const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  steps: Number, sittingHours: Number, sleepHours: Number,
  waterIntake: Number, caloriesBurned: Number, activityType: String,
  sedentaryAlert: Boolean, riskIncrease: Number, notes: String
});
module.exports = mongoose.model('Activity', activitySchema);
