import mongoose from 'mongoose';
import SalaryPaymentDetail from '../models/salaryPaymentDetail.js';

export const getSalaryPaymentDetails = async (req, res) => {
  try {
    const SalaryPaymentDetails = await SalaryPaymentDetail.find();

    res.status(200).json(SalaryPaymentDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSalaryPaymentDetailsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const salaryPaymentDetails = await SalaryPaymentDetail.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: salaryPaymentDetails });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createSalaryPaymentDetail = async (req, res) => {
  const salaryPaymentDetail = req.body;
  const newSalaryPaymentDetail = new SalaryPaymentDetail({
    ...salaryPaymentDetail,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newSalaryPaymentDetail.save();

    res.status(201).json(newSalaryPaymentDetail);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSalaryPaymentDetail = async (req, res) => {
  const { id: _id } = req.params;
  const salaryPaymentDetail = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No salary payment detail with that id!');

  const updatedSalaryPaymentDetail = await SalaryPaymentDetail.findByIdAndUpdate(
    _id,
    { ...salaryPaymentDetail, _id },
    { new: true }
  );

  res.json(updatedSalaryPaymentDetail);
};

export const deleteSalaryPaymentDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No salary payment detail with that id!');

  await SalaryPaymentDetail.findByIdAndRemove(id);

  res.json({ message: 'SalaryPaymentDetail deleted successfully!' });
};
