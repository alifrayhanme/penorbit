import { db } from '@/lib/database';

export async function GET() {
  try {
    const users = await db.getUsers();
    return Response.json(users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status || 'active',
      createdAt: u.createdAt || new Date().toISOString()
    })));
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}