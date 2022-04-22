import mongoose from 'mongoose';
import TeacherPayment from '../models/teacherPayment.js';

export const getTeacherPayments = async (req, res) => {
  try {
    const TeacherPayments = await TeacherPayment.find();

    res.status(200).json(TeacherPayments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTeacherPaymentsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const teacherPayments = await TeacherPayment.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: teacherPayments });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTeacherPayment = async (req, res) => {
  const teacherPayment = req.body;
  const newTeacherPayment = new TeacherPayment({
    ...teacherPayment,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newTeacherPayment.save();

    res.status(201).json(newTeacherPayment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateTeacherPayment = async (req, res) => {
  const { id: _id } = req.params;
  const teacherPayment = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No salary payment detail with that id!');

  const updatedTeacherPayment = await TeacherPayment.findByIdAndUpdate(
    _id,
    { ...teacherPayment, _id },
    { new: true }
  );

  res.json(updatedTeacherPayment);
};

export const deleteTeacherPayment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No salary payment detail with that id!');

  await TeacherPayment.findByIdAndRemove(id);

  res.json({ message: 'Teacher payment deleted successfully!' });
};
