import { NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/api/openai';

export async function POST(request: Request) {
  try {
    const { category, criteria } = await request.json();

    if (!category || !criteria) {
      return NextResponse.json(
        { error: 'Category and criteria are required' },
        { status: 400 }
      );
    }

    const recommendations = await generateRecommendations(category, criteria);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 