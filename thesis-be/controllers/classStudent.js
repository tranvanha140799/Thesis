import mongoose from 'mongoose';
import ClassStudent from '../models/classStudent.js';

export const getClassStudents = async (req, res) => {
  try {
    const ClassStudents = await ClassStudent.find();

    res.status(200).json(ClassStudents);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getClassStudentsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const classStudents = await ClassStudent.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: classStudents });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createClassStudent = async (req, res) => {
  const classStudent = req.body;
  const newClassStudent = new ClassStudent({
    ...classStudent,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newClassStudent.save();

    res.status(201).json(newClassStudent);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateClassStudent = async (req, res) => {
  const { id: _id } = req.params;
  const classStudent = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No classStudent with that id!');

  const updatedClassStudent = await ClassStudent.findByIdAndUpdate(
    _id,
    { ...classStudent, _id },
    { new: true }
  );

  res.json(updatedClassStudent);
};

export const deleteClassStudent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No classStudent with that id!');

  await ClassStudent.findByIdAndRemove(id);

  res.json({ message: 'ClassStudent deleted successfully!' });
};

// export const likeClassStudent = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No classStudent with that id!');

//   const classStudent = await ClassStudent.findById(id);

//   const index = classStudent.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     classStudent.likes.push(String(req.userId));
//   } else {
//     classStudent.likes = classStudent.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedClassStudent = await ClassStudent.findByIdAndUpdate(id, classStudent, { new: true });

//   res.json(updatedClassStudent);
// };
