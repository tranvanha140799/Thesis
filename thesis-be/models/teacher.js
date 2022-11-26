import mongoose from 'mongoose';

const teacherSchema = mongoose.Schema({
  teacherId: String,
  fullname: String,
  gender: String,
  birthday: String,
  email: String,
  address: String,
  phoneNumber: String,
  image: String,
  position: String, // Vị trí công việc: trợ giảng, giảng viên
  workType: String, // Kiểu làm việc: parttime, fulltime,...
  status: String, // Trạng thái: đã nghỉ, đang làm, tạm nghỉ,...
  contractSalary: Number, // Lương hợp đồng
  salaryFactorId: String, // Mã hệ số lương
  classId: String, // Lớp đang giảng dạy
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
