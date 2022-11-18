import mongoose from 'mongoose';

const courseSchema = mongoose.Schema({
  courseId: String,
  name: String,
  tuitionFee: Number,
  description: String,
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
