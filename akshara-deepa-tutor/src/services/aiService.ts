import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please add it in the Secrets panel.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateChapterSummary(chapterName: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert tutor for 10th-grade SSLC students. Provide a concise, easy-to-understand summary of the chapter: ${chapterName}. Include 3 key takeaways and 1 memory tip. Keep it student-friendly and encouraging.`,
  });
  return response.text;
}

export async function getStudyTips(weakSubjects: string[]) {
  const ai = getAI();
  const subjectsList = weakSubjects.join(", ");
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The student is currently struggling with: ${subjectsList}. 
    Provide 3 personalized study tips to improve in these areas. 
    Also, generate a motivational message in one sentence to boost their confidence.`,
  });
  return response.text;
}

export async function explainConcept(concept: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the concept of "${concept}" to a 15-year-old student in a simple, engaging way using an analogy from everyday life.`,
  });
  return response.text;
}

export async function generateRevisionPlan(performanceData: any) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this student's performance data: ${JSON.stringify(performanceData)}, 
    create a 7-day revision plan. Focus more on the weak areas while maintaining a balance. 
    Format the output as a simple list for each day.`,
  });
  return response.text;
}
