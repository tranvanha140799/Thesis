import mongoose from 'mongoose';

const salaryFactorSchema = mongoose.Schema({
  salaryFactorId: String, // Mã hệ số lương
  name: String,
  factor: Number, // Hệ số
  allowance: Number, // Trợ cấp
});

const SalaryFactor = mongoose.model('SalaryFactor', salaryFactorSchema);

export default SalaryFactor;
