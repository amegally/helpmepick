import OpenAI from 'openai';
import { ProductRecommendation } from '@/types/wizard';
import { generateAmazonAffiliateUrl } from './amazon';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFollowUpQuestion(category: string): Promise<string> {
  const prompt = `As a shopping assistant, ask ONE specific follow-up question to understand the user's needs for: "${category}". Focus on key criteria like budget, usage, or preferences. Make it conversational and friendly.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 50, // Reduced since we only need a short question
  });

  return response.choices[0]?.message?.content?.trim() || "What specific features or requirements are most important to you?";
}

interface OpenAIRecommendation {
  name: string;
  description: string;
  explanation: string;
  price: string;
  rating: number;
}

interface OpenAIResponse {
  recommendations: OpenAIRecommendation[];
}

export async function generateRecommendations(
  category: string,
  criteria: string
): Promise<ProductRecommendation[]> {
  const prompt = `Recommend 5 ${category} products based on: "${criteria}".
Return JSON only:
{
  "recommendations": [
    {
      "name": "Brief product name",
      "description": "2-3 key features",
      "explanation": "Why it matches criteria",
      "price": "$XX.XX",
      "rating": 4.5,
      "personalNote": "A friendly, conversational sentence explaining why this would be perfect for the user"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: "You are a friendly product recommendation expert. Be concise yet conversational. Focus on real, current products with realistic prices. Make your personal notes sound like advice from a knowledgeable friend."
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  try {
    const content = response.choices[0]?.message?.content || "{}";
    const data = JSON.parse(content) as OpenAIResponse;
    return (data.recommendations || []).map((rec: OpenAIRecommendation) => ({
      ...rec,
      amazonUrl: generateAmazonAffiliateUrl(rec.name)
    }));
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return [];
  }
} 