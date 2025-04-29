import { NextResponse } from 'next/server';
import { validateProductCategory } from '@/lib/api/openai';
import { rateLimit } from '@/lib/api/rate-limit';

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const limiter = await rateLimit();
    const remaining = await limiter.removeTokens(1);
    
    if (remaining < 0) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request. Query is required.' },
        { status: 400 }
      );
    }

    // Validate the product category
    const validation = await validateProductCategory(query);

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Error in validate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 