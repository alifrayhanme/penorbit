import { db } from '@/lib/database';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const subscriber = await db.addSubscriber(email.toLowerCase().trim());
    
    if (!subscriber) {
      return Response.json({ error: 'Email already subscribed' }, { status: 400 });
    }

    return Response.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!',
      subscriber 
    });
  } catch (error) {
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscribers = await db.getSubscribers();
    return Response.json({ subscribers, count: subscribers.length });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}