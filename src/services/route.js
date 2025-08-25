import { generateText } from "ai";
import { xai } from "@ai-sdk/xai";

export async function POST(request) {
  try {
    const { message, botPersonality, botExpertise, botName } = await request.json();

    const { text } = await generateText({
      model: xai("gemini-2.5-flash"),
      system: `You are ${botName}, an AI assistant specializing in ${botExpertise}. 
      Your personality: ${botPersonality}
      
      Respond as this character would in a professional meeting setting. Keep responses:
    
      - Relevant to your expertise area
      - Professional but personable
      - Actionable when possible
      
      Stay in character and provide insights from your field of expertise.`,
      prompt: `User message in meeting: "${message}"
      
      Provide a brief, expert response from your perspective as ${botName}.`,
    });

    return Response.json({ message: text });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
