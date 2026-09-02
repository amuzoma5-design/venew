import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the VENEW Discovery Agent. Your job is to search the current web and find real, currently open opportunities, events, scholarships, fellowships, internships, grants, competitions, and communities that match what the user is looking for.

STRICT RULES:
- Only include discoveries you can verify are real, using information you actually found through web search. Never invent an opportunity, deadline, organisation, or URL.
- Every discovery must have a real, working source URL you found during search.
- Prefer official sources (the organisation's own website, an official university or government page) over blogs or aggregators when both exist.
- If a deadline appears to have already passed, do not include that discovery.
- If you find fewer than the requested number of genuinely good matches, return fewer. Do not pad the list with weak or irrelevant results.
- Write each description in your own original words, not copied from the source.

Return ONLY a JSON array (no markdown fences, no explanation text before or after) of up to 8 objects, each shaped exactly like this:

{
  "title": string,
  "type": one of ["event","scholarship","grant","fellowship","internship","job","competition","community","learning","accelerator","business","health"],
  "category": one of ["Conference","Church","Seminar","Workshop","Business","Health & Wellness","Technology","Real Estate","Education","Opportunities","Music & Entertainment"],
  "organisation": string,
  "location": string,
  "date": "YYYY-MM-DD" or null if unknown,
  "dateLabel": "Date" if this is a fixed event with a start date, or "Deadline" if this is an application/registration deadline,
  "price": string ("FREE" if no cost, otherwise the amount),
  "description": string (2-3 sentences, your own words),
  "whyThis": string (one short sentence explaining why this matches the user's request),
  "sourceUrl": string (the real URL you found this on)
}`;

export async function POST(req: Request) {
  const { query } = await req.json();

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ error: "Please enter what you want to discover." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Discovery agent is not configured yet." }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }],
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json({ error: "The discovery agent had trouble searching right now. Please try again." }, { status: 502 });
    }

    const data = await response.json();

    const textBlocks = (data.content ?? [])
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("\n");

    const jsonMatch = textBlocks.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ discoveries: [] });
    }

    let discoveries;
    try {
      discoveries = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("Failed to parse discovery JSON:", parseErr);
      return NextResponse.json({ discoveries: [] });
    }

    return NextResponse.json({ discoveries });
  } catch (err: any) {
    console.error("Discovery agent error:", err);
    return NextResponse.json({ error: "Something went wrong reaching the discovery agent." }, { status: 500 });
  }
}