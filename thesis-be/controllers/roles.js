import mongoose from 'mongoose';
import Role from '../models/role.js';

export const getRoles = async (req, res) => {
  try {
    const Roles = await Role.find();

    res.status(200).json(Roles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRolesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const role = await Role.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: role });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createRole = async (req, res) => {
  const role = req.body;
  const newRole = new Role({
    ...role,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newRole.save();

    res.status(201).json(newRole);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  const { id: _id } = req.params;
  const role = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No role with that id!');

  const updatedRole = await Role.findByIdAndUpdate(
    _id,
    { ...role, _id },
    { new: true }
  );

  res.json(updatedRole);
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No role with that id!');

  await Role.findByIdAndRemove(id);

  res.json({ message: 'Role deleted successfully!' });
};

// export const likeRole = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No role with that id!');

//   const role = await Role.findById(id);

//   const index = role.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     role.likes.push(String(req.userId));
//   } else {
//     role.likes = role.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedRole = await Role.findByIdAndUpdate(id, role, { new: true });

//   res.json(updatedRole);
// };
