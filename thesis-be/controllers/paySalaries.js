import mongoose from 'mongoose';
import PaySalary from '../models/paySalary.js';

export const getPaySalaries = async (req, res) => {
  try {
    const PaySalaries = await PaySalary.find();

    res.status(200).json(PaySalaries);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPaySalariesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const paySalaries = await PaySalary.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: paySalaries });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPaySalary = async (req, res) => {
  const paySalary = req.body;
  const newPaySalary = new PaySalary({
    ...paySalary,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newPaySalary.save();

    res.status(201).json(newPaySalary);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePaySalary = async (req, res) => {
  const { id: _id } = req.params;
  const paySalary = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No paySalary with that id!');

  const updatedPaySalary = await PaySalary.findByIdAndUpdate(
    _id,
    { ...paySalary, _id },
    { new: true }
  );

  res.json(updatedPaySalary);
};

export const deletePaySalary = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No paySalary with that id!');

  await PaySalary.findByIdAndRemove(id);

  res.json({ message: 'PaySalary deleted successfully!' });
};

// export const likePaySalary = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No paySalary with that id!');

//   const paySalary = await PaySalary.findById(id);

//   const index = paySalary.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     paySalary.likes.push(String(req.userId));
//   } else {
//     paySalary.likes = paySalary.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedPaySalary = await PaySalary.findByIdAndUpdate(id, paySalary, { new: true });

//   res.json(updatedPaySalary);
// };
