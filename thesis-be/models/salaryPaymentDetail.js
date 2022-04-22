import mongoose from 'mongoose';

const salaryPaymentDetailSchema = mongoose.Schema({
  teacherId: String,
  salaryRankId: String,
  paymentDate: String,
});

const SalaryPaymentDetail = mongoose.model(
  'SalaryPaymentDetail',
  salaryPaymentDetailSchema
);

export default SalaryPaymentDetail;
