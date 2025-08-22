import { db } from '@/lib/database';

export async function GET() {
  try {
    const posts = await db.getPosts();
    return Response.json(posts);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.title?.trim() || !body.summary?.trim()) {
      return Response.json({ error: 'Title and summary are required' }, { status: 400 });
    }

    if (!body.details?.trim()) {
      return Response.json({ error: 'Details are required' }, { status: 400 });
    }

    const post = await db.createPost({
      title: body.title.trim(),
      summary: body.summary.trim(),
      details: body.details.trim(),
      category: body.category?.trim() || 'General',
      bannerImage: body.bannerImage?.trim() || '/blogbannerimage.jpg',
      authorId: body.authorId || 1,
      author: body.author || { name: 'Anonymous', email: '' }
    });

    return Response.json({ message: 'Post created', post }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}