import { db } from '@/lib/database';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { userId } = await request.json();
    
    if (!userId) {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    const result = await db.dislikePost(id, userId);
    
    if (!result) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json({ 
      likes: result.post.likes,
      dislikes: result.post.dislikes,
      userReaction: result.userReaction
    });
  } catch (error) {
    return Response.json({ error: 'Failed to dislike post' }, { status: 500 });
  }
}