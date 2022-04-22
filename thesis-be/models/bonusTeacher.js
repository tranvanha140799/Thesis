import mongoose from 'mongoose';

const bonusTeacherSchema = mongoose.Schema({
  bonusSheetId: String,
  teacherId: String,
  bonusAmount: Number,
});

const BonusTeacher = mongoose.model('BonusTeacher', bonusTeacherSchema);

export default BonusTeacher;
