import mongoose from 'mongoose';
import Teacher from '../models/teacher.js';

export const getTeachers = async (req, res) => {
  try {
    const Teachers = await Teacher.find();

    res.status(200).json(Teachers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTeachersBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const teachers = await Teacher.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: teachers });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  const teacher = req.body;
  const newTeacher = new Teacher({
    ...teacher,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newTeacher.save();

    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  const { id: _id } = req.params;
  const teacher = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No teacher with that id!');

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    _id,
    { ...teacher, _id },
    { new: true }
  );

  res.json(updatedTeacher);
};

export const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No teacher with that id!');

  await Teacher.findByIdAndRemove(id);

  res.json({ message: 'Teacher deleted successfully!' });
};

// export const likeTeacher = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No teacher with that id!');

//   const teacher = await Teacher.findById(id);

//   const index = teacher.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     teacher.likes.push(String(req.userId));
//   } else {
//     teacher.likes = teacher.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedTeacher = await Teacher.findByIdAndUpdate(id, teacher, { new: true });

//   res.json(updatedTeacher);
// };
