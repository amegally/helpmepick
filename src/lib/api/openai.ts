import OpenAI from 'openai';
import { ProductRecommendation } from '@/types/wizard';
import { generateAmazonAffiliateUrl } from './amazon';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFollowUpQuestion(category: string, originalInput?: string): Promise<string> {
  const prompt = `As a shopping assistant, analyze the user's request and ask 1-2 follow-up questions.

Original request: "${originalInput || category}"
Normalized category: "${category}"

First, analyze what information the user has already provided in their request.
Then, ask follow-up questions about important missing information to find the right product on amazon.com such as:
- Intended use case or specific requirements (if not clear)
- Important features or preferences that are important to the product category on amazon.com
- Budget constraints (if not mentioned)


Rules:
- Don't ask about information already provided in the original request
- Focus on what's most important for this specific product category on amazon.com. Be specifc in your questions to guide the user to find the right product.
- Make questions conversational and friendly and to help us guide the user to find the right product on amazon.com
- Don't use quotation marks in your response. Respond with just the question(s) and nothing else`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: "You are a friendly shopping assistant. Analyze requests carefully to avoid asking about information already provided. Be direct and conversational. Never use quotation marks in responses."
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 100, // Increased slightly to allow for better analysis
  });

  const question = response.choices[0]?.message?.content?.trim() || "What specific features or requirements are most important to you?";
  return question.replace(/['"]/g, '');
}

interface OpenAIRecommendation {
  name: string;
  description: string;
  explanation: string;
  price: string;
  rating: number;
  personalNote: string;
}

interface OpenAIResponse {
  recommendations: OpenAIRecommendation[];
}

export async function generateRecommendations(
  category: string,
  criteria: string,
  originalInput?: string
): Promise<ProductRecommendation[]> {
  const prompt = `Generate product recommendations based on the following user request:

Initial Request: "${originalInput || category}"
Product Category: "${category}"
Additional Criteria: "${criteria}"

Return 5 specific product recommendations from amazon.com that best match ALL of the following:
1. The user's initial request and intent
2. The specific criteria provided
3. The product category requirements

Return JSON only:
{
  "recommendations": [
    {
      "name": "Brief product name",
      "description": "2-3 key features",
      "explanation": "Why this matches both the initial request and additional criteria",
      "price": "$XX.XX",
      "rating": 4.5,
      "personalNote": "A natural sounding response explaining why this would be perfect for the user. Don't use the word 'I'. Vary the beginning of the sentence to avoid repetition."
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: "You are a friendly product recommendation expert. Be concise yet conversational. Focus on real, current products with realistic prices. Make your personal notes sound like a recommendation from a knowledgeable friend but don't use the word 'I'. Consider both the user's initial request and their additional criteria when making recommendations."
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

interface ProductValidation {
  isValid: boolean;
  category: string | null;
  suggestion?: string;
  confidence: number;
  reason?: string;
}

export async function validateProductCategory(input: string): Promise<ProductValidation> {
  const prompt = `As a shopping assistant, analyze if the following question can be answered by a purchasable product on Amazon:
"${input}"

Consider:
1. Is this a request for help in finding a physical product that can be purchased on amazon.com?

Return a JSON response with:
{
  "isValid": boolean (true if this is a valid request for finding a product),
  "category": string or null (normalized category name if valid, null if invalid),
  "confidence": number (between 0 and 1),
  "suggestion": string (optional, alternative suggestion if invalid),
  "reason": string (explanation why it's valid/invalid)
}

Example valid inputs: "gaming laptop", "yoga mat", "coffee maker", "Help me pick the best gift for momC"
Example invalid inputs: "happiness", "life advice", "apartment buildings", "AI software"

Only respond with valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: "You are a product validation expert. Be precise in determining if queries are for purchasable products on amazon.com."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent validation
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content) as ProductValidation;
  } catch (error) {
    console.error('Error validating product category:', error);
    // Return a safe default that indicates validation failed
    return {
      isValid: false,
      category: null,
      confidence: 0,
      reason: "Failed to validate the product category. Please try again."
    };
  }
} 