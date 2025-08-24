import { db } from '@/lib/database';
import bcrypt from 'bcryptjs';

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

export async function POST(request) {
  try {
    const { name, email, password, role = 'user', adminEmail } = await request.json();
    
    if (!adminEmail || adminEmail !== 'admin@penorbit.com') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    const user = await db.createUser(newUser);
    
    return Response.json({ 
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}