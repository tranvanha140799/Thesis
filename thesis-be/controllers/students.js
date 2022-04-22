import mongoose from 'mongoose';
import Student from '../models/student.js';

export const getStudents = async (req, res) => {
  try {
    const Students = await Student.find();

    res.status(200).json(Students);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getStudentsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const students = await Student.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: students });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  const student = req.body;
  const newStudent = new Student({
    ...student,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  const { id: _id } = req.params;
  const student = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No student with that id!');

  const updatedStudent = await Student.findByIdAndUpdate(
    _id,
    { ...student, _id },
    { new: true }
  );

  res.json(updatedStudent);
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No student with that id!');

  await Student.findByIdAndRemove(id);

  res.json({ message: 'Student deleted successfully!' });
};

// export const likeStudent = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No student with that id!');

//   const student = await Student.findById(id);

//   const index = student.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     student.likes.push(String(req.userId));
//   } else {
//     student.likes = student.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedStudent = await Student.findByIdAndUpdate(id, student, { new: true });

//   res.json(updatedStudent);
// };
