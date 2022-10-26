import mongoose from 'mongoose';
import ClassSchedule from '../models/classSchedule.js';

export const getClassSchedules = async (req, res) => {
  try {
    const ClassSchedules = await ClassSchedule.find();

    res.status(200).json(ClassSchedules);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getClassSchedulesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const classSchedules = await ClassSchedule.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: classSchedules });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createClassSchedule = async (req, res) => {
  const classSchedule = req.body;
  const newClassSchedule = new ClassSchedule({
    ...classSchedule,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newClassSchedule.save();

    res.status(201).json(newClassSchedule);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateClassSchedule = async (req, res) => {
  const { id: _id } = req.params;
  const classSchedule = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No classSchedule with that id!');

  const updatedClassSchedule = await ClassSchedule.findByIdAndUpdate(
    _id,
    { ...classSchedule, _id },
    { new: true }
  );

  res.json(updatedClassSchedule);
};

export const deleteClassSchedule = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No classSchedule with that id!');

  await ClassSchedule.findByIdAndRemove(id);

  res.json({ message: 'ClassSchedule deleted successfully!' });
};

// export const likeClassSchedule = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No classSchedule with that id!');

//   const classSchedule = await ClassSchedule.findById(id);

//   const index = classSchedule.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     classSchedule.likes.push(String(req.userId));
//   } else {
//     classSchedule.likes = classSchedule.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedClassSchedule = await ClassSchedule.findByIdAndUpdate(id, classSchedule, { new: true });

//   res.json(updatedClassSchedule);
// };
