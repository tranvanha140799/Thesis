import mongoose from 'mongoose';
import Schedule from '../models/schedule.js';

export const getSchedules = async (req, res) => {
  try {
    const Schedules = await Schedule.find();

    res.status(200).json(Schedules);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSchedulesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const schedules = await Schedule.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: schedules });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  const schedule = req.body;
  const newSchedule = new Schedule({
    ...schedule,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  const { id: _id } = req.params;
  const schedule = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No schedule with that id!');

  const updatedSchedule = await Schedule.findByIdAndUpdate(
    _id,
    { ...schedule, _id },
    { new: true }
  );

  res.json(updatedSchedule);
};

export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No schedule with that id!');

  await Schedule.findByIdAndRemove(id);

  res.json({ message: 'Schedule deleted successfully!' });
};

// export const likeSchedule = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No schedule with that id!');

//   const schedule = await Schedule.findById(id);

//   const index = schedule.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     schedule.likes.push(String(req.userId));
//   } else {
//     schedule.likes = schedule.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedSchedule = await Schedule.findByIdAndUpdate(id, schedule, { new: true });

//   res.json(updatedSchedule);
// };
