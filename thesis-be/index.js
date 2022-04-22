import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; // thư viện thao tác với file .env

// import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import teacherRoutes from './routes/teachers.js';
import studentRoutes from './routes/students.js';
import salariesRoutes from './routes/salaries.js';
import salaryPaymentDetailRoutes from './routes/salayPaymentDetail.js';
import teacherPaymentRoutes from './routes/teacherPayment.js';
import expenseOfMonthSheetRoutes from './routes/expenseOfMonthSheet.js';

const app = express();
dotenv.config(); // ~ import biến từ file .env

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/salaries', salariesRoutes);
app.use('/salary-payment-detail', salaryPaymentDetailRoutes);
app.use('/teacher-payment', teacherPaymentRoutes);
app.use('/expense-of-month-sheets', expenseOfMonthSheetRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server dang hoat dong o cong: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

//  mongoose.set('useFindAndModify', false);
