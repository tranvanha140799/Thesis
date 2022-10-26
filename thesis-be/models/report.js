import mongoose from 'mongoose';

const reportSchema = mongoose.Schema({
  type: String,
  amountOfMoney: Number,
  isApproved: Boolean,
  dateApproved: String,
  statusId: String,
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
