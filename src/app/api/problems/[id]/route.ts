import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const problem = await prisma.problem.findUnique({
      where: {
        id,
        // @ts-ignore
        userId: session.user.id
      }
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const existingProblem = await prisma.problem.findUnique({
      where: {
        id,
        // @ts-ignore
        userId: session.user.id
      }
    });

    if (!existingProblem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const problem = await prisma.problem.update({
      where: { id },
      data: {
        url: data.url,
        title: data.title,
        platform: data.platform,
        difficulty: data.difficulty,
        solvedBy: data.solvedBy,
        tags: data.tags,
        keyInsights: data.keyInsights,
        mistakes: data.mistakes
      }
    });

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingProblem = await prisma.problem.findUnique({
      where: {
        id,
        // @ts-ignore
        userId: session.user.id
      }
    });

    if (!existingProblem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    await prisma.problem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 });
  }
}
