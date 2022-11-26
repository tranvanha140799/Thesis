import mongoose from 'mongoose';

const classStudentSchema = mongoose.Schema({
  class_id: String,
  student_id: String,
  classId: String, // Mã lớp public
  paidTuitionFee: Number, // Số tiền đã nộp
  payTime: Number, // Lần nộp (1, 2, 3,...)
  payAmount: Number, // Số tiền nộp của lần này (bản ghi này)
  payDate: String, // Ngày nộp
  expiryDatePayTuitionFee: String, // Hạn nộp phần còn lại
});

const ClassStudent = mongoose.model('ClassStudent', classStudentSchema);

export default ClassStudent;
