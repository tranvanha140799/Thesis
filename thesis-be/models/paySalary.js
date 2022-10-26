import mongoose from 'mongoose';

const paySalarySchema = mongoose.Schema({
  period: String, // Chu kỳ (thời gian) trả lương (tháng)
  salary: Number, // Lương
  isPaidSalary: Boolean, // Đã trả lương hay chưa?
  datePaidSalary: String,
  advancePayment: Number, // Khoản lương thanh toán trước (ứng lương)
  teacherId: String,
});

const PaySalary = mongoose.model('PaySalary', paySalarySchema);

export default PaySalary;
