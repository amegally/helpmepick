import { NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/api/openai';
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

    const { category, criteria, originalInput } = await request.json();

    if (!category || !criteria) {
      return NextResponse.json(
        { error: 'Category and criteria are required' },
        { status: 400 }
      );
    }

    const recommendations = await generateRecommendations(category, criteria, originalInput);
    
    // Return the response with rate limit headers
    return NextResponse.json(
      { recommendations },
      {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 