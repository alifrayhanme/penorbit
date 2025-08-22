import { db } from '@/lib/database';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!body.adminEmail || body.adminEmail !== 'admin@penorbit.com') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    await db.deleteSubscriber(id);
    return Response.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}