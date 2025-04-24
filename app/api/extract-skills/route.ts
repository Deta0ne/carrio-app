import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing text" },
        { status: 400 }
      );
    }

    const prompt = `
    You are an expert CV/resume analyzer. Analyze the following text extracted from a PDF, which might be in any language.
    
    IMPORTANT CHARACTER ENCODING NOTE: During PDF extraction, the letter 'i' is sometimes replaced with characters like '/', '#', '(', '+', '>', or 'A'. Consider this when analyzing the text.
    
    Perform a comprehensive analysis and extract all of the following categories with high precision:
    
    • Technical Skills: ALL programming languages, frameworks, technologies, platforms, methodologies, AND software tools. Include ALL technical tools, development environments, and software mentioned. Be comprehensive and thorough.
    
    • Soft Skills: Communication, leadership, problem-solving, teamwork, etc.
    
    • Domain Knowledge: Specific industries, sectors, or business domains the person has expertise in.
    
    • Languages: ONLY include languages that are EXPLICITLY stated as spoken/written by the person with clear evidence. Do NOT include languages mentioned in context of travel, education location, or project work unless explicitly stated as a language skill. For example, "Erasmus in Portugal" does NOT mean the person speaks Portuguese unless specifically stated.
    
    • Education: Degrees, certificates, courses, and training.
    
    • Project Keywords: Key technical terms, methodologies, or domains from projects.
    
    • Job Titles: ONLY include actual position titles/roles (e.g., "Software Engineer", "Project Manager"). DO NOT include company names, departments, or any other information - strictly job titles only.
    
    • Responsibilities: Key responsibilities or achievements that demonstrate skills.
    
    Format your response strictly as valid JSON with the following structure:
    {
        "Technical Skills": ["..."],
        "Soft Skills": ["..."],
        "Domain Knowledge": ["..."],
        "Languages": ["..."],
        "Education": ["..."],
        "Job Titles": ["..."],
        "Responsibilities": ["..."]
    }
    
    Text to analyze:
    ${text}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1500,
      response_format: { type: "json_object" } // JSON formatında yanıt iste
    });

    // API'den dönen yanıtı işleme
    const responseText = completion.choices[0].message.content || "";
    
    try {
      // JSON stringi parse et
      const parsedSkills = JSON.parse(responseText);
      
      // Düz beceri listesi de oluşturalım (geriye dönük uyumluluk için)
      const flatSkills = Object.values(parsedSkills).flat() as string[];
      
      return NextResponse.json({
        skills: flatSkills,
        categorized_skills: parsedSkills
      });
    } catch (error) {
      console.error("Skills JSON parsing error:", error);
      return NextResponse.json(
        { error: "Failed to parse skills data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 