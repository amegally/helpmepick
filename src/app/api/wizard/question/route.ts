import { NextResponse } from 'next/server';
import { generateFollowUpQuestion } from '@/lib/api/openai';
import { rateLimit } from '@/lib/middleware/rateLimit';

const limiter = rateLimit({
  maxRequests: 10, // 10 requests
  windowMs: 60 * 1000, // per minute
});

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResult = await limiter(request);
    
    // If it's a NextResponse, it means we hit the rate limit
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult;
    }

    // Get the rate limit info
    const rateLimit = rateLimitResult || { limit: 10, remaining: 9, reset: Date.now() + 60000 };

    const { category, originalInput } = await request.json();

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const question = await generateFollowUpQuestion(category, originalInput);
    
    // Return the response with rate limit headers
    return NextResponse.json(
      { question },
      {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
} 