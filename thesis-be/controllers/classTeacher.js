import mongoose from 'mongoose';
import ClassTeacher from '../models/classTeacher.js';

export const getClassTeachers = async (req, res) => {
  try {
    const ClassTeachers = await ClassTeacher.find();

    res.status(200).json(ClassTeachers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getClassTeachersBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const classTeachers = await ClassTeacher.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: classTeachers });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createClassTeacher = async (req, res) => {
  const classTeacher = req.body;
  const newClassTeacher = new ClassTeacher({
    ...classTeacher,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newClassTeacher.save();

    res.status(201).json(newClassTeacher);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateClassTeacher = async (req, res) => {
  const { id: _id } = req.params;
  const classTeacher = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No classTeacher with that id!');

  const updatedClassTeacher = await ClassTeacher.findByIdAndUpdate(
    _id,
    { ...classTeacher, _id },
    { new: true }
  );

  res.json(updatedClassTeacher);
};

export const deleteClassTeacher = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No classTeacher with that id!');

  await ClassTeacher.findByIdAndRemove(id);

  res.json({ message: 'ClassTeacher deleted successfully!' });
};

// export const likeClassTeacher = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No classTeacher with that id!');

//   const classTeacher = await ClassTeacher.findById(id);

//   const index = classTeacher.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     classTeacher.likes.push(String(req.userId));
//   } else {
//     classTeacher.likes = classTeacher.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedClassTeacher = await ClassTeacher.findByIdAndUpdate(id, classTeacher, { new: true });

//   res.json(updatedClassTeacher);
// };
