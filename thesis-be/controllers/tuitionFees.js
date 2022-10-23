import mongoose from 'mongoose';
import TuitionFee from '../models/tuitionFee.js';

export const getTuitionFees = async (req, res) => {
  try {
    const TuitionFees = await TuitionFee.find();

    res.status(200).json(TuitionFees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTuitionFeesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const tuitionFees = await TuitionFee.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: tuitionFees });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTuitionFee = async (req, res) => {
  const tuitionFee = req.body;
  const newTuitionFee = new TuitionFee({
    ...tuitionFee,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newTuitionFee.save();

    res.status(201).json(newTuitionFee);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateTuitionFee = async (req, res) => {
  const { id: _id } = req.params;
  const tuitionFee = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No tuitionFee with that id!');

  const updatedTuitionFee = await TuitionFee.findByIdAndUpdate(
    _id,
    { ...tuitionFee, _id },
    { new: true }
  );

  res.json(updatedTuitionFee);
};

export const deleteTuitionFee = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No tuitionFee with that id!');

  await TuitionFee.findByIdAndRemove(id);

  res.json({ message: 'TuitionFee deleted successfully!' });
};

// export const likeTuitionFee = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No tuitionFee with that id!');

//   const tuitionFee = await TuitionFee.findById(id);

//   const index = tuitionFee.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     tuitionFee.likes.push(String(req.userId));
//   } else {
//     tuitionFee.likes = tuitionFee.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedTuitionFee = await TuitionFee.findByIdAndUpdate(id, tuitionFee, { new: true });

//   res.json(updatedTuitionFee);
// };
