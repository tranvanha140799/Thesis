import mongoose from 'mongoose';

const statusSchema = mongoose.Schema({
  name: String,
});

const Status = mongoose.model('Status', statusSchema);

export default Status;
