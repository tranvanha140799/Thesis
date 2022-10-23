import mongoose from 'mongoose';

const classScheduleSchema = mongoose.Schema({
  classId: String,
  teacherId: String,
  scheduleId: String, // Mã buổi học
  session: String,
});

const classSchedule = mongoose.model('classSchedule', classScheduleSchema);

export default classSchedule;
