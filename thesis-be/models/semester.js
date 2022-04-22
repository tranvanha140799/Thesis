import mongoose from 'mongoose';

const semesterSchema = mongoose.Schema({
  semesterId: String,
  semestername: String,
  begintime: String,
  endtime: String,
  status: String,
});

const Semester = mongoose.model('Semester', semesterSchema);

export default Semester;
