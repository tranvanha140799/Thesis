import mongoose from 'mongoose';

const teacherSchema = mongoose.Schema({
  teacherId: String,
  fullname: String,
  gender: String,
  birthday: String,
  email: String,
  address: String,
  phoneNumber: String,
  degree: String,
  position: String,
  subjectId: String,
  status: String,
  salaryRankId: String,
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
