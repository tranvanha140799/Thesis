import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  roleId: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;
