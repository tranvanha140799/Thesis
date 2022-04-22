import mongoose from 'mongoose';

const teacherPaymentSchema = mongoose.Schema({
  expenseOfMonthSheetId: String,
  teacherId: String,
  amount: Number,
});

const TeacherPayment = mongoose.model('TeacherPayment', teacherPaymentSchema);

export default TeacherPayment;
