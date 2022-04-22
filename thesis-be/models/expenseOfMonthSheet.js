import mongoose from 'mongoose';

const expenseOfMonthSheetSchema = mongoose.Schema({
  expenseOfMonthSheetId: String,
  createBy: String,
  createDate: String,
});

const ExpenseOfMonthSheet = mongoose.model(
  'ExpenseOfMonthSheet',
  expenseOfMonthSheetSchema
);

export default ExpenseOfMonthSheet;
