import mongoose from 'mongoose';
import Exempt from '../models/exempt.js';

export const getExempts = async (req, res) => {
  try {
    const Exempts = await Exempt.find();

    res.status(200).json(Exempts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getExemptsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const exempts = await Exempt.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: exempts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createExempt = async (req, res) => {
  const exempt = req.body;
  const newExempt = new Exempt({
    ...exempt,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newExempt.save();

    res.status(201).json(newExempt);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateExempt = async (req, res) => {
  const { id: _id } = req.params;
  const exempt = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No exempt with that id!');

  const updatedExempt = await Exempt.findByIdAndUpdate(
    _id,
    { ...exempt, _id },
    { new: true }
  );

  res.json(updatedExempt);
};

export const deleteExempt = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No exempt with that id!');

  await Exempt.findByIdAndRemove(id);

  res.json({ message: 'Exempt deleted successfully!' });
};

// export const likeExempt = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No exempt with that id!');

//   const exempt = await Exempt.findById(id);

//   const index = exempt.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     exempt.likes.push(String(req.userId));
//   } else {
//     exempt.likes = exempt.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedExempt = await Exempt.findByIdAndUpdate(id, exempt, { new: true });

//   res.json(updatedExempt);
// };
