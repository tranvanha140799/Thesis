import mongoose from 'mongoose';
import Permission from '../models/permission.js';

export const getPermissions = async (req, res) => {
  try {
    const Permissions = await Permission.find();

    res.status(200).json(Permissions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPermissionsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const permissions = await Permission.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: permissions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPermission = async (req, res) => {
  const permission = req.body;
  const newPermission = new Permission({
    ...permission,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newPermission.save();

    res.status(201).json(newPermission);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePermission = async (req, res) => {
  const { id: _id } = req.params;
  const permission = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No permission with that id!');

  const updatedPermission = await Permission.findByIdAndUpdate(
    _id,
    { ...permission, _id },
    { new: true }
  );

  res.json(updatedPermission);
};

export const deletePermission = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No permission with that id!');

  await Permission.findByIdAndRemove(id);

  res.json({ message: 'Permission deleted successfully!' });
};

// export const likePermission = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No permission with that id!');

//   const permission = await Permission.findById(id);

//   const index = permission.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     permission.likes.push(String(req.userId));
//   } else {
//     permission.likes = permission.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedPermission = await Permission.findByIdAndUpdate(id, permission, { new: true });

//   res.json(updatedPermission);
// };
