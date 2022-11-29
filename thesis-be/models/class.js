import mongoose from 'mongoose';

const classSchema = mongoose.Schema({
  classId: String,
  name: String,
  numberOfStudents: Number,
  dateStart: String,
  dateEnd: String,
  minStudents: Number,
  maxStudents: Number,
  discount: Number,
  status: String,
  courseId: String,
  schedules: Array,
});

const Class = mongoose.model('Class', classSchema);

export default Class;
