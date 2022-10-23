import mongoose from 'mongoose';
import Discount from '../models/discount.js';

export const getDiscounts = async (req, res) => {
  try {
    const Discounts = await Discount.find();

    res.status(200).json(Discounts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDiscountsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const discounts = await Discount.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: discounts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDiscount = async (req, res) => {
  const discount = req.body;
  const newDiscount = new Discount({
    ...discount,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newDiscount.save();

    res.status(201).json(newDiscount);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateDiscount = async (req, res) => {
  const { id: _id } = req.params;
  const discount = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No discount with that id!');

  const updatedDiscount = await Discount.findByIdAndUpdate(
    _id,
    { ...discount, _id },
    { new: true }
  );

  res.json(updatedDiscount);
};

export const deleteDiscount = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No discount with that id!');

  await Discount.findByIdAndRemove(id);

  res.json({ message: 'Discount deleted successfully!' });
};

// export const likeDiscount = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No discount with that id!');

//   const discount = await Discount.findById(id);

//   const index = discount.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     discount.likes.push(String(req.userId));
//   } else {
//     discount.likes = discount.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedDiscount = await Discount.findByIdAndUpdate(id, discount, { new: true });

//   res.json(updatedDiscount);
// };
