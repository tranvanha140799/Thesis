import mongoose from 'mongoose';

const classTeacherSchema = mongoose.Schema({
  class_id: String,
  teacher_id: String,
  classId: String,
});

const ClassTeacher = mongoose.model('ClassTeacher', classTeacherSchema);

export default ClassTeacher;
