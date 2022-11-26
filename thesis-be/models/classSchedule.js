import mongoose from 'mongoose';

const classScheduleSchema = mongoose.Schema({
  classId: String,
  scheduleId: String,
  session: String,
});

const ClassSchedule = mongoose.model('classSchedule', classScheduleSchema);

export default ClassSchedule;
