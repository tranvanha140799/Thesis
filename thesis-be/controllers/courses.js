import mongoose from 'mongoose';
import Course from '../models/course.js';

export const getCourses = async (req, res) => {
  try {
    const Courses = await Course.find();

    res.status(200).json(Courses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCoursesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const courses = await Course.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: courses });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  const course = req.body;
  const newCourse = new Course({
    ...course,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  const { id: _id } = req.params;
  const course = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No course with that id!');

  const updatedCourse = await Course.findByIdAndUpdate(
    _id,
    { ...course, _id },
    { new: true }
  );

  res.json(updatedCourse);
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No course with that id!');

  await Course.findByIdAndRemove(id);

  res.json({ message: 'Course deleted successfully!' });
};

// export const likeCourse = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No course with that id!');

//   const course = await Course.findById(id);

//   const index = course.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     course.likes.push(String(req.userId));
//   } else {
//     course.likes = course.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedCourse = await Course.findByIdAndUpdate(id, course, { new: true });

//   res.json(updatedCourse);
// };
