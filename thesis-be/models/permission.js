import mongoose from 'mongoose';

const permissionSchema = mongoose.Schema({
  name: String,
  resourceCode: String,
  roleId: String,
});

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
