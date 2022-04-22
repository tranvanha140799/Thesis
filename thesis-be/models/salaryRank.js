import mongoose from 'mongoose';

const salaryRankSchema = mongoose.Schema({
  salaryRankId: String, // Mã mức lương
  basicSalary: Number, // Lương cơ bản
  allowance: Number, // Phụ cấp
  coefficient: Number, // Hệ số
});

const SalaryRank = mongoose.model('SalaryRank', salaryRankSchema);

export default SalaryRank;
