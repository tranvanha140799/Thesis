import mongoose from 'mongoose';

const roleSchema = mongoose.Schema({
  id: { type: String },
  name: String,
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
