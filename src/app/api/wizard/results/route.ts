import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/db';
import { nanoid } from 'nanoid';

// POST /api/wizard/results - Save wizard results
export async function POST(request: Request) {
  const prisma = getPrismaClient();
  
  try {
    const { category, criteria, recommendations } = await request.json();

    if (!category || !criteria || !recommendations) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique, URL-friendly permalink
    const permalink = nanoid(10); // 10 character unique ID

    // Save the wizard result
    const result = await prisma.wizardResult.create({
      data: {
        category,
        criteria,
        recommendations,
        permalink,
      },
    });

    return NextResponse.json({
      permalink,
      id: result.id,
    });
  } catch (error) {
    console.error('Error saving wizard results:', error);
    return NextResponse.json(
      { error: 'Failed to save results' },
      { status: 500 }
    );
  }
}

// GET /api/wizard/results?permalink=xyz - Retrieve wizard results
export async function GET(request: Request) {
  const prisma = getPrismaClient();
  
  try {
    const { searchParams } = new URL(request.url);
    const permalink = searchParams.get('permalink');

    if (!permalink) {
      return NextResponse.json(
        { error: 'Permalink is required' },
        { status: 400 }
      );
    }

    const result = await prisma.wizardResult.findUnique({
      where: { permalink },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Results not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error retrieving wizard results:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve results' },
      { status: 500 }
    );
  }
} 