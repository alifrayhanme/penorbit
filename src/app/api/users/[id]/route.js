import { db } from '@/lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status, adminEmail } = await request.json();
    
    // Check if requester is admin
    if (adminEmail !== 'admin@penorbit.com') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!['active', 'suspended'].includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    const user = await db.updateUserStatus(id, status);
    
    if (!user) {
      return Response.json({ error: 'User not found or cannot be modified' }, { status: 404 });
    }

    return Response.json({ message: 'User status updated', user });
  } catch (error) {
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { adminEmail } = await request.json();
    
    // Check if requester is admin
    if (adminEmail !== 'admin@penorbit.com') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.deleteUser(id);
    
    if (!user) {
      return Response.json({ error: 'User not found or cannot be deleted' }, { status: 404 });
    }

    return Response.json({ message: 'User deleted successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}