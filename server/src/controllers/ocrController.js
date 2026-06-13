const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { extractTextFromImage } = require("../services/ocrService");

const extractText = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  if (req.file.mimetype === "application/pdf") {
    throw new ApiError(400, "PDF OCR is not enabled yet. Please upload JPG, PNG, or WEBP.");
  }

  const text = await extractTextFromImage(req.file.path);
  if (!text) {
    throw new ApiError(422, "No readable text found in the image");
  }

  res.json({ text });
});

module.exports = { extractText };
