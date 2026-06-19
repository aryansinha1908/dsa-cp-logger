import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const difficulty = searchParams.get('difficulty');
    const query = searchParams.get('query');

    const where: any = {
      // @ts-ignore
      userId: session.user.id,
    };

    if (platform) where.platform = platform;
    if (difficulty) where.difficulty = difficulty;
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } }
      ];
    }

    const problems = await prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // @ts-ignore
    const userId = session.user.id;

    const problem = await prisma.problem.create({
      data: {
        userId,
        url: data.url,
        title: data.title,
        platform: data.platform,
        difficulty: data.difficulty,
        tags: data.tags || [],
        keyInsights: data.keyInsights,
        mistakes: data.mistakes
      }
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}
