import mongoose from 'mongoose';

const courseSchema = mongoose.Schema({
  name: String,
  tuitionFee: Number,
  desciption: String,
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
