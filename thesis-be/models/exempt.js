import mongoose from 'mongoose';

const exemptSchema = mongoose.Schema({
  name: String,
  percent: Number,
  note: String,
});

const Exempt = mongoose.model('Exempt', exemptSchema);

export default Exempt;
