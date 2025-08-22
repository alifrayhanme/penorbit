import { db } from '@/lib/database';

export async function PUT(request) {
  try {
    const { userId, name, profession, profilePic } = await request.json();
    
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updatedUser = await db.updateUserProfile(userId, { name, profession, profilePic });
    
    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ 
      message: 'Profile updated successfully', 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profession: updatedUser.profession,
        profilePic: updatedUser.profilePic,
        role: updatedUser.role,
        status: updatedUser.status
      }
    });
  } catch (error) {
    return Response.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}