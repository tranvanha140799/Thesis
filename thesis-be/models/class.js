import mongoose from 'mongoose';

const classSchema = mongoose.Schema({
  classId: String,
  classname: String,
  subjectId: String,
  studentQuantity: Number,
  status: String,
});

const Class = mongoose.model('Class', classSchema);

export default Class;
