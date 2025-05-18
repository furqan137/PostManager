import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for search
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    // Build search query
    const searchQuery = query 
      ? { 
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } }
          ] 
        } 
      : {};
    
    // Execute query with sorting
    const sortOption: Record<string, 1 | -1> = {};
    sortOption[sort] = order === 'asc' ? 1 : -1;
    
    const posts = await Post.find(searchQuery)
      .sort(sortOption)
      .select('_id title content author createdAt updatedAt');
    
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validate request body
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const post = await Post.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}