const OpenAI = require("openai");
const { env } = require("../config/env");

function fallbackSummary(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
  return sentences.slice(0, 3).join(" ").slice(0, 700).trim();
}

async function summarizeText(text) {
  if (!env.openAiApiKey) {
    return fallbackSummary(text);
  }

  const client = new OpenAI({ apiKey: env.openAiApiKey });
  const response = await client.chat.completions.create({
    model: env.openAiModel,
    messages: [
      {
        role: "system",
        content: "Summarize institution notices in 3-4 crisp lines. Preserve deadlines, actions, places, and eligibility."
      },
      { role: "user", content: String(text || "") }
    ],
    temperature: 0.2,
    max_tokens: 180
  });

  return response.choices[0]?.message?.content?.trim() || fallbackSummary(text);
}

module.exports = { summarizeText };
