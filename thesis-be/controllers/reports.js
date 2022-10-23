import mongoose from 'mongoose';
import Report from '../models/report.js';

export const getReports = async (req, res) => {
  try {
    const Reports = await Report.find();

    res.status(200).json(Reports);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getReportsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const reports = await Report.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.json({ data: reports });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createReport = async (req, res) => {
  const report = req.body;
  const newReport = new Report({
    ...report,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newReport.save();

    res.status(201).json(newReport);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateReport = async (req, res) => {
  const { id: _id } = req.params;
  const report = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No report with that id!');

  const updatedReport = await Report.findByIdAndUpdate(
    _id,
    { ...report, _id },
    { new: true }
  );

  res.json(updatedReport);
};

export const deleteReport = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No report with that id!');

  await Report.findByIdAndRemove(id);

  res.json({ message: 'Report deleted successfully!' });
};

// export const likeReport = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) return res.json({ message: 'Unauthenticated!' });

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send('No report with that id!');

//   const report = await Report.findById(id);

//   const index = report.likes.findIndex((id) => id === String(req.userId));
//   if (index === -1) {
//     report.likes.push(String(req.userId));
//   } else {
//     report.likes = report.likes.filter((id) => id !== String(req.userId));
//   }

//   const updatedReport = await Report.findByIdAndUpdate(id, report, { new: true });

//   res.json(updatedReport);
// };
