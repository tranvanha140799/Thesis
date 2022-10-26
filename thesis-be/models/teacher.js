import mongoose from 'mongoose';

const teacherSchema = mongoose.Schema({
  teacherId: String,
  fullname: String,
  gender: String,
  birthday: String,
  email: String,
  address: String,
  phoneNumber: String,
  position: String, // Vị trí công việc: trợ giảng, gv chính
  workType: String, // Kiểu làm việc: parttime, fulltime,...
  status: String, // Trạng thái: đã nghỉ, đang làm, tạm nghỉ,...
  contractSalary: Number, // Lương hợp đồng
  salaryFactorId: String, // Mã hệ số lương
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
