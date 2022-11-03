import mongoose from 'mongoose';

const paySalarySchema = mongoose.Schema({
  period: String, // Thời gian trả lương - kỳ lương (tháng mấy??)
  salary: Number, // Lương
  isPaidSalary: Boolean, // Đã trả lương hay chưa?
  datePaidSalary: String, // Ngày trả lương
  advancePayment: Number, // Khoản lương thanh toán trước (ứng lương)
  teacherId: String,
});

const PaySalary = mongoose.model('PaySalary', paySalarySchema);

export default PaySalary;
