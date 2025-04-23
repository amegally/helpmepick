import OpenAI from 'openai';
import { ProductRecommendation } from '@/types/wizard';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFollowUpQuestion(category: string): Promise<string> {
  const prompt = `You are a helpful shopping assistant. Given the following product category, generate ONE specific follow-up question to better understand the user's needs. The question should help narrow down the best product recommendations.

Category: "${category}"

Generate a clear, concise question that will help understand the user's specific needs. The question should be direct and help gather important criteria for making product recommendations.

Question:`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 100,
  });

  return response.choices[0]?.message?.content?.trim() || "What specific features or requirements are most important to you?";
}

export async function generateRecommendations(
  category: string,
  criteria: string
): Promise<ProductRecommendation[]> {
  const prompt = `You are a helpful shopping assistant. Based on the following category and criteria, recommend 5 specific products available on Amazon. For each product, provide a name, brief description, and explanation of why it matches the user's needs.

Category: "${category}"
Criteria: "${criteria}"

Provide 5 recommendations in the following JSON format:
{
  "recommendations": [
    {
      "name": "Product Name",
      "description": "Brief product description",
      "explanation": "Why this matches the user's needs",
      "price": "Estimated price",
      "rating": Estimated rating (1-5),
      "amazonUrl": "amazon.com/search?q=product+name"
    }
  ]
}

Ensure prices are realistic and include the $ symbol. Ratings should be between 1-5.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
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
    const data = JSON.parse(content);
    return data.recommendations || [];
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return [];
  }
} 