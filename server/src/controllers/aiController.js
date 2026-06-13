const ApiError = require("../utils/apiError");
const Notice = require("../models/Notice");
const asyncHandler = require("../utils/asyncHandler");
const { summarizeText } = require("../services/summaryService");

const summarize = asyncHandler(async (req, res) => {
  const { text, noticeId } = req.body;
  if (!text && !noticeId) {
    throw new ApiError(400, "Text or noticeId is required");
  }

  let sourceText = text;
  let notice = null;
  if (noticeId) {
    notice = await Notice.findById(noticeId);
    if (!notice) throw new ApiError(404, "Notice not found");
    if (notice.summary) return res.json({ summary: notice.summary });
    sourceText = `${notice.title}\n\n${notice.desc}`;
  }

  const summary = await summarizeText(sourceText);
  if (notice) {
    notice.summary = summary;
    await notice.save();
  }

  res.json({ summary });
});

module.exports = { summarize };
