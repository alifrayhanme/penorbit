import { NextResponse } from "next/server";
import { db } from '@/lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status, adminEmail } = await request.json();
    
    if (adminEmail !== 'admin@penorbit.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!['read', 'unread'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const result = await db.updateContactStatus(parseInt(id), status);
    
    if (!result) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact status updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { adminEmail } = await request.json();
    
    if (adminEmail !== 'admin@penorbit.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await db.deleteContact(parseInt(id));
    
    if (!result) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}