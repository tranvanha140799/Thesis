import mongoose from 'mongoose';

const classStudentSchema = mongoose.Schema({
  classId: String,
  studentId: String,
  paidTuitionFee: Number,
  lastestDatePaid: String,
  expiryDatePayTuitionFee: String,
});

const ClassStudent = mongoose.model('ClassStudent', classStudentSchema);

export default ClassStudent;
