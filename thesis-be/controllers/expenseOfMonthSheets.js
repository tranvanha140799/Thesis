import mongoose from 'mongoose';
import ExpenseOfMonthSheet from '../models/expenseOfMonthSheet.js';

export const getExpenseOfMonthSheets = async (req, res) => {
  try {
    const ExpenseOfMonthSheets = await ExpenseOfMonthSheet.find();

    res.status(200).json(ExpenseOfMonthSheets);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getExpenseOfMonthSheetsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const expenseOfMonthSheets = await ExpenseOfMonthSheet.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: expenseOfMonthSheets });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createExpenseOfMonthSheet = async (req, res) => {
  const expenseOfMonthSheet = req.body;
  const newExpenseOfMonthSheet = new ExpenseOfMonthSheet({
    ...expenseOfMonthSheet,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newExpenseOfMonthSheet.save();

    res.status(201).json(newExpenseOfMonthSheet);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateExpenseOfMonthSheet = async (req, res) => {
  const { id: _id } = req.params;
  const expenseOfMonthSheet = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No expenseOfMonthSheet with that id!');

  const updatedExpenseOfMonthSheet = await ExpenseOfMonthSheet.findByIdAndUpdate(
    _id,
    { ...expenseOfMonthSheet, _id },
    { new: true }
  );

  res.json(updatedExpenseOfMonthSheet);
};

export const deleteExpenseOfMonthSheet = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No expense of month sheet with that id!');

  await ExpenseOfMonthSheet.findByIdAndRemove(id);

  res.json({ message: 'ExpenseOfMonthSheet deleted successfully!' });
};

// export const likeExpenseOfMonthSheet = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No expenseOfMonthSheet with that id!');

//   const expenseOfMonthSheet = await ExpenseOfMonthSheet.findById(id);

//   const index = expenseOfMonthSheet.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     expenseOfMonthSheet.likes.push(String(req.userId));
//   } else {
//     expenseOfMonthSheet.likes = expenseOfMonthSheet.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedExpenseOfMonthSheet = await ExpenseOfMonthSheet.findByIdAndUpdate(id, expenseOfMonthSheet, { new: true });

//   res.json(updatedExpenseOfMonthSheet);
// };
