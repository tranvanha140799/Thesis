import mongoose from 'mongoose';
import SalaryFactor from '../models/salaryFactor.js';

export const getSalaryFactors = async (req, res) => {
  try {
    const SalaryFactors = await SalaryFactor.find();

    res.status(200).json(SalaryFactors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSalaryFactorsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const salaryFactors = await SalaryFactor.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: salaryFactors });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createSalaryFactor = async (req, res) => {
  const salaryFactor = req.body;
  const newSalaryFactor = new SalaryFactor({
    ...salaryFactor,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newSalaryFactor.save();

    res.status(201).json(newSalaryFactor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSalaryFactor = async (req, res) => {
  const { id: _id } = req.params;
  const salaryFactor = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No salaryFactor with that id!');

  const updatedSalaryFactor = await SalaryFactor.findByIdAndUpdate(
    _id,
    { ...salaryFactor, _id },
    { new: true }
  );

  res.json(updatedSalaryFactor);
};

export const deleteSalaryFactor = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No salaryFactor with that id!');

  await SalaryFactor.findByIdAndRemove(id);

  res.json({ message: 'SalaryFactor deleted successfully!' });
};

// export const likeSalaryFactor = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No salaryFactor with that id!');

//   const salaryFactor = await SalaryFactor.findById(id);

//   const index = salaryFactor.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     salaryFactor.likes.push(String(req.userId));
//   } else {
//     salaryFactor.likes = salaryFactor.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedSalaryFactor = await SalaryFactor.findByIdAndUpdate(id, salaryFactor, { new: true });

//   res.json(updatedSalaryFactor);
// };
