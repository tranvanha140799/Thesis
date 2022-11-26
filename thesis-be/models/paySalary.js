import mongoose from 'mongoose';

const paySalarySchema = mongoose.Schema({
  period: String, // Thời gian trả lương - kỳ lương (tháng mấy??)
  periodSalary: Number, // Tổng lương tháng
  paidSalary: Number, // Lương đã trả (hoặc tiền đã ứng trước)
  isPaidSalary: Boolean, // Đã trả lương hay chưa?
  // (luôn là false khi chưa trả đủ lương tháng (paidSalary !== periodSalary))
  datePaidSalary: String, // Ngày trả lương gần nhất (có thể là ứng lương)
  isAdvancePayment: Boolean, // Có phải ứng lương ko?
  advancePayment: Number, // Số tiền ứng lương (chỉ ứng lương 1 lần trong tháng)
  teacherId: String,
});

const PaySalary = mongoose.model('PaySalary', paySalarySchema);

export default PaySalary;
