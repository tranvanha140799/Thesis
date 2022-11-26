import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv'; // thư viện thao tác với file .env
import express from 'express';
import mongoose from 'mongoose';

import classScheduleRoutes from './routes/classSchedule.js';
import classStudentRoutes from './routes/classStudent.js';
import classTeacherRoutes from './routes/classTeacher.js';
import classRoutes from './routes/classes.js';
import courseRoutes from './routes/courses.js';
import discountRoutes from './routes/discounts.js';
import exemptRoutes from './routes/exempts.js';
import paySalaryRoutes from './routes/paySalaries.js';
import permissionRoutes from './routes/permissions.js';
import reportRoutes from './routes/reports.js';
import roleRoutes from './routes/roles.js';
import salaryFactorRoutes from './routes/salaryFactors.js';
import scheduleRoutes from './routes/schedules.js';
import statusRoutes from './routes/statuses.js';
import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import tuitionFeeRoutes from './routes/tuitionFees.js';
import userRoutes from './routes/users.js';

const app = express();
dotenv.config(); // ~ import biến từ file .env

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/class-schedule', classScheduleRoutes);
app.use('/class-student', classStudentRoutes);
app.use('/class-teacher', classTeacherRoutes);
app.use('/classes', classRoutes);
app.use('/courses', courseRoutes);
app.use('/discounts', discountRoutes);
app.use('/exempts', exemptRoutes);
app.use('/pay-salaries', paySalaryRoutes);
app.use('/permissions', permissionRoutes);
app.use('/reports', reportRoutes);
app.use('/roles', roleRoutes);
app.use('/salary-factors', salaryFactorRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/statuses', statusRoutes);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/tuition-fees', tuitionFeeRoutes);
app.use('/users', userRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server's running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));

//  mongoose.set('useFindAndModify', false);
