import mongoose from 'mongoose';

const discountSchema = mongoose.Schema({
  code: String,
  name: String,
  percent: Number,
  description: String,
});

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
