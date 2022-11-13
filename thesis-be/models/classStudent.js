import mongoose from 'mongoose';

const classStudentSchema = mongoose.Schema({
  class_id: String,
  student_id: String,
  classId: String, // Mã lớp public
  paidTuitionFee: Number,
  lastestDatePaid: String,
  expiryDatePayTuitionFee: String,
});

const ClassStudent = mongoose.model('ClassStudent', classStudentSchema);

export default ClassStudent;
