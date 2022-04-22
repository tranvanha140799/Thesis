import mongoose from 'mongoose';
import SalaryRank from '../models/salaryRank.js';

export const getSalaries = async (req, res) => {
  try {
    const Salaries = await SalaryRank.find();

    res.status(200).json(Salaries);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSalariesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const salaries = await SalaryRank.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: salaries });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createSalary = async (req, res) => {
  const salary = req.body;
  const newSalary = new SalaryRank({
    ...salary,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newSalary.save();

    res.status(201).json(newSalary);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSalary = async (req, res) => {
  const { id: _id } = req.params;
  const salary = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No salary with that id!');

  const updatedSalary = await SalaryRank.findByIdAndUpdate(
    _id,
    { ...salary, _id },
    { new: true }
  );

  res.json(updatedSalary);
};

export const deleteSalary = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No salary with that id!');

  await SalaryRank.findByIdAndRemove(id);

  res.json({ message: 'Salary deleted successfully!' });
};

// export const likeSalary = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No salary with that id!');

//   const salary = await Salary.findById(id);

//   const index = salary.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     salary.likes.push(String(req.userId));
//   } else {
//     salary.likes = salary.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedSalary = await Salary.findByIdAndUpdate(id, salary, { new: true });

//   res.json(updatedSalary);
// };
