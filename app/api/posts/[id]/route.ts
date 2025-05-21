import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Post from '@/lib/models/Post';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
