import mongoose from 'mongoose';

const tuitionFeeSheetSchema = mongoose.Schema({
  tuitionFeeSheetId: String,
  createDate: String,
  createBy: String,
  studentId: String,
  semesterId: String,
  fee: Number,
});

const TuitionFeeSheet = mongoose.model('TuitionFeeSheet', tuitionFeeSheetSchema);

export default TuitionFeeSheet;
