export async function fetchOpenAISummary(text) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Summarize astrology data:\n${text}` }]
    }),
  });

  if (!response.ok) throw new Error("Failed to fetch OpenAI response");
  const result = await response.json();
  return result.choices[0].message.content;
}