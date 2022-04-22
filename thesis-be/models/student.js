import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
  studentId: String,
  fullname: String,
  birthday: String,
  gender: String,
  address: String,
  phoneNumber: String,
  classId: String,
  status: String,
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
