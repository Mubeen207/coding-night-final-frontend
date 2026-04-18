import { NextResponse } from "next/server";
import { processWithAI } from "@/lib/ai";

export async function POST(req) {
  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json({ error: "Description required" }, { status: 400 });
    }

    // Use the AI processing function
    const aiResult = processWithAI(description);

    // Generate rewrite suggestion
    let rewrite = "";
    if (description.length > 20) {
      // Create a more polished version
      const sentences = description.split(/[.!?]+/).filter(s => s.trim());
      if (sentences.length > 0) {
        rewrite = `I'm looking for help with: ${description.trim()} Can someone with ${aiResult.tags.slice(0, 2).join(' or ') || 'relevant'} experience assist?`;
      }
    }

    return NextResponse.json({
      category: aiResult.category,
      urgency: aiResult.urgency,
      tags: aiResult.tags,
      rewrite: rewrite || description
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
