import { db } from '@/lib/database';

export async function DELETE(request) {
  try {
    const { postId, commentId } = await request.json();
    


    const post = await db.deleteComment(postId, commentId);
    
    if (!post) {
      return Response.json({ error: 'Comment not found' }, { status: 404 });
    }

    return Response.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { postId, commentId } = await request.json();
    


    const post = await db.suspendComment(postId, commentId);
    
    if (!post) {
      return Response.json({ error: 'Comment not found' }, { status: 404 });
    }

    return Response.json({ message: 'Comment status updated' });
  } catch (error) {
    return Response.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}