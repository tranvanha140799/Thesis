import mongoose from 'mongoose';

const scheduleSchema = mongoose.Schema({
  name: String,
  timeStart: String,
  timeEnd: String,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
