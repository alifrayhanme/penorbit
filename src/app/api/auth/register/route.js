import { db } from '@/lib/database';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, profession, profilePic } = body;

    // Validation
    if (!name || !email || !password || !profession) {
      return Response.json({ error: 'Name, email, password and profession are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user
    const user = await db.createUser({
      name,
      email,
      password: hashedPassword,
      profession,
      profilePic: profilePic || '',
      role: 'user'
    });

    return Response.json({ 
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 201 });

  } catch (error) {
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}