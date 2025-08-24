import { db } from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return Response.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    const post = await db.getPostById(id);
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return Response.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const { adminEmail, userId } = body;
    
    // Get the post to check ownership
    const post = await db.getPostById(id);
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Check if requester is admin OR post owner
    const isAdmin = adminEmail === 'admin@penorbit.com';
    const isOwner = userId && (post.authorId.toString() === userId.toString());
    
    if (!isAdmin && !isOwner) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const deletedPost = await db.deletePost(id);
    if (!deletedPost) {
      return Response.json({ error: 'Failed to delete post' }, { status: 500 });
    }
    
    return Response.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return Response.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    const { adminEmail } = await request.json();
    
    // Only admin can suspend posts
    if (adminEmail !== 'admin@penorbit.com') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const post = await db.suspendPost(id);
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Post status updated', post });
  } catch (error) {
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return Response.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const { userId, title, bannerImage, category, summary, details } = body;
    
    // Get the post to check ownership
    const post = await db.getPostById(id);
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Check if requester is the post owner
    if (!userId || post.authorId.toString() !== userId.toString()) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedPost = await db.updatePost(id, {
      title,
      bannerImage,
      category,
      summary,
      details,
      updatedAt: new Date().toISOString()
    });
    
    if (!updatedPost) {
      return Response.json({ error: 'Failed to update post' }, { status: 500 });
    }
    
    return Response.json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}