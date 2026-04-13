import { NextResponse } from 'next/server';
import { z } from 'zod';
import { subscribeEmail } from '@/lib/newsletter';

const subscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = subscribeSchema.parse(body);
    const subscriber = await subscribeEmail(payload.email);
    const message = subscriber.isFirstSubscription
      ? 'Subscription successful. Please check your inbox for a confirmation email.'
      : 'You are already subscribed. You will continue receiving blog updates.';

    return NextResponse.json({
      ok: true,
      subscriber,
      message,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to subscribe right now.' },
      { status: 400 }
    );
  }
}
