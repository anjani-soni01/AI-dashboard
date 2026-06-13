const fs = require("fs/promises");
const Tesseract = require("tesseract.js");

async function extractTextFromImage(filePath) {
  const result = await Tesseract.recognize(filePath, "eng");
  const text = result.data.text.trim();
  await fs.unlink(filePath).catch(() => {});
  return text;
}

module.exports = { extractTextFromImage };
