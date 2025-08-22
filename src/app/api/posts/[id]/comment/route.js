import { db } from '@/lib/database';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { text, userId } = await request.json();
    
    if (!text || text.trim() === '') {
      return Response.json({ error: 'Comment text is required' }, { status: 400 });
    }

    // Get user name from database using userId
    let userName = 'Anonymous';
    if (userId) {
      const user = await db.getUserById(userId);
      userName = user?.name || 'Anonymous';
    }

    const post = await db.addComment(id, {
      text: text.trim(),
      user: userName
    });
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json({ comments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    return Response.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}