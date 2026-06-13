const ApiError = require("../utils/apiError");
const Notice = require("../models/Notice");
const asyncHandler = require("../utils/asyncHandler");
const { summarizeText } = require("../services/summaryService");

function buildNoticeQuery(query) {
  const filter = {};
  if (query.category && query.category !== "All") filter.category = query.category;
  if (query.filter === "upcoming") filter.deadline = { $gte: new Date() };
  if (query.search) filter.$text = { $search: query.search };
  return filter;
}

const getNotices = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;
  const filter = buildNoticeQuery(req.query);

  const [notices, total] = await Promise.all([
    Notice.find(filter)
      .populate("createdBy", "name role")
      .sort({ pinned: -1, deadline: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notice.countDocuments(filter)
  ]);

  res.json({ notices, total });
});

const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate("createdBy", "name role");
  if (!notice) throw new ApiError(404, "Notice not found");
  res.json({ notice });
});

const createNotice = asyncHandler(async (req, res) => {
  const { title, desc, category, deadline, priority, pinned } = req.body;
  const notice = await Notice.create({
    title,
    desc,
    category,
    deadline,
    priority,
    pinned,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    createdBy: req.user._id
  });

  res.status(201).json({ notice });
});

const updateNotice = asyncHandler(async (req, res) => {
  const allowed = ["title", "desc", "category", "deadline", "priority", "pinned"];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
  if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

  const notice = await Notice.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!notice) throw new ApiError(404, "Notice not found");
  res.json({ notice });
});

const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) throw new ApiError(404, "Notice not found");
  res.json({ message: "deleted" });
});

const getNoticeSummary = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) throw new ApiError(404, "Notice not found");

  if (!notice.summary) {
    notice.summary = await summarizeText(`${notice.title}\n\n${notice.desc}`);
    await notice.save();
  }

  res.json({ summary: notice.summary });
});

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  getNoticeSummary
};
