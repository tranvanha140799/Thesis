import mongoose from 'mongoose';

const subjectSchema = mongoose.Schema({
  subjectId: String,
  name: String,
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
