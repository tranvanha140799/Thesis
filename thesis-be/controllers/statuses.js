import mongoose from 'mongoose';
import Status from '../models/status.js';

export const getStatuses = async (req, res) => {
  try {
    const Statuses = await Status.find();

    res.status(200).json(Statuses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getStatusesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const statuses = await Status.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: statuses });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createStatus = async (req, res) => {
  const status = req.body;
  const newStatus = new Status({
    ...status,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newStatus.save();

    res.status(201).json(newStatus);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { id: _id } = req.params;
  const status = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No status with that id!');

  const updatedStatus = await Status.findByIdAndUpdate(
    _id,
    { ...status, _id },
    { new: true }
  );

  res.json(updatedStatus);
};

export const deleteStatus = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No status with that id!');

  await Status.findByIdAndRemove(id);

  res.json({ message: 'Status deleted successfully!' });
};

// export const likeStatus = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No status with that id!');

//   const status = await Status.findById(id);

//   const index = status.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     status.likes.push(String(req.userId));
//   } else {
//     status.likes = status.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedStatus = await Status.findByIdAndUpdate(id, status, { new: true });

//   res.json(updatedStatus);
// };
