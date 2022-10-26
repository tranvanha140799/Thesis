import mongoose from 'mongoose';

const tuitionFeeSchema = mongoose.Schema({
  studentId: String,
  classId: String,
});

const TuitionFee = mongoose.model('TuitionFee', tuitionFeeSchema);

export default TuitionFee;
