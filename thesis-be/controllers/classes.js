import mongoose from 'mongoose';
import Class from '../models/class.js';

export const getClasses = async (req, res) => {
  try {
    const Classes = await Class.find();

    res.status(200).json(Classes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getClassesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const classes = await Class.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: classes });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  const clasS = req.body;
  const newClass = new Class({
    ...clasS,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newClass.save();

    res.status(201).json(newClass);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateClass = async (req, res) => {
  const { id: _id } = req.params;
  const clasS = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No class with that id!');

  const updatedClass = await Class.findByIdAndUpdate(
    _id,
    { ...clasS, _id },
    { new: true }
  );

  res.json(updatedClass);
};

export const deleteClass = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No class with that id!');

  await Class.findByIdAndRemove(id);

  res.json({ message: 'Class deleted successfully!' });
};

// export const likeClass = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No class with that id!');

//   const clasS = await Class.findById(id);

//   const index = clasS.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     clasS.likes.push(String(req.userId));
//   } else {
//     clasS.likes = clasS.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedClass = await Class.findByIdAndUpdate(id, clasS, { new: true });

//   res.json(updatedClass);
// };
