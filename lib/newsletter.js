import 'server-only';

import { createSupabaseAdminClient, hasSupabaseConfig } from '@/lib/supabase';

const NEWSLETTER_TABLE = 'newsletter_subscribers';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

function buildBlogNotificationEmail(post) {
  const blogUrl = `${getSiteUrl()}/blog/${post.slug}`;
  const title = post.title || 'New blog post';
  const excerpt = post.excerpt || 'There is an update in the blog.';

  return {
    subject: `Blog update: ${title}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:620px;margin:0 auto;padding:24px;">
        <p style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#475569;margin-bottom:8px;">Blog Update</p>
        <h1 style="font-size:24px;line-height:1.2;margin:0 0 12px;">${title}</h1>
        <p style="margin:0 0 16px;color:#334155;">${excerpt}</p>
        <a href="${blogUrl}" style="display:inline-block;padding:10px 16px;background:#1d4ed8;color:#ffffff;text-decoration:none;font-weight:700;">Read article</a>
        <p style="margin-top:24px;font-size:12px;color:#64748b;">You received this because you subscribed to blog updates.</p>
      </div>
    `,
  };
}

function buildSubscriptionSuccessEmail() {
  const blogUrl = `${getSiteUrl()}/blog`;

  return {
    subject: 'Subscription confirmed: you will receive blog updates',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:620px;margin:0 auto;padding:24px;">
        <p style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#475569;margin-bottom:8px;">Subscription Confirmed</p>
        <h1 style="font-size:24px;line-height:1.2;margin:0 0 12px;">You are now subscribed</h1>
        <p style="margin:0 0 16px;color:#334155;">Thanks for subscribing. You will receive email updates when new articles are published or existing articles are updated.</p>
        <a href="${blogUrl}" style="display:inline-block;padding:10px 16px;background:#1d4ed8;color:#ffffff;text-decoration:none;font-weight:700;">Open blog</a>
      </div>
    `,
  };
}

export async function subscribeEmail(email) {
  if (!hasSupabaseConfig()) {
    throw new Error('Supabase is not configured for newsletter subscription.');
  }

  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Invalid email address.');
  }

  const client = createSupabaseAdminClient();
  if (!client) {
    throw new Error('Supabase is not configured for newsletter subscription.');
  }

  const { data: existing } = await client
    .from(NEWSLETTER_TABLE)
    .select('email, status')
    .eq('email', cleanEmail)
    .maybeSingle();

  const payload = {
    email: cleanEmail,
    status: 'active',
    subscribed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await client
    .from(NEWSLETTER_TABLE)
    .upsert(payload, { onConflict: 'email' });

  if (error) {
    throw new Error(error.message);
  }

  const isFirstSubscription = !existing;
  let confirmation = { attempted: false, sent: false };

  if (isFirstSubscription) {
    const content = buildSubscriptionSuccessEmail();
    const result = await sendWithResend({
      to: cleanEmail,
      subject: content.subject,
      html: content.html,
    });

    confirmation = {
      attempted: true,
      sent: result.sent,
      reason: result.sent ? undefined : result.reason,
    };
  }

  return {
    email: cleanEmail,
    status: 'active',
    isFirstSubscription,
    confirmation,
  };
}

export async function listActiveSubscribers() {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const client = createSupabaseAdminClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from(NEWSLETTER_TABLE)
    .select('email')
    .eq('status', 'active');

  if (error || !data) {
    return [];
  }

  return data.map((row) => normalizeEmail(row.email)).filter(Boolean);
}

async function sendWithResend({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_SENDER_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, reason: 'missing-email-provider-config' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    return { sent: false, reason: payload?.message || 'email-send-failed' };
  }

  return { sent: true };
}

export async function notifyBlogSubscribers(post) {
  const subscribers = await listActiveSubscribers();

  if (!subscribers.length) {
    return { attempted: 0, sent: 0, skipped: true, reason: 'no-subscribers' };
  }

  const emailPayload = buildBlogNotificationEmail(post);
  let sent = 0;
  const failed = [];

  for (const email of subscribers) {
    const result = await sendWithResend({
      to: email,
      subject: emailPayload.subject,
      html: emailPayload.html,
    });

    if (result.sent) {
      sent += 1;
      continue;
    }

    failed.push({ email, reason: result.reason });
  }

  return {
    attempted: subscribers.length,
    sent,
    skipped: sent === 0,
    reason: sent === 0 ? failed[0]?.reason || 'email-send-failed' : undefined,
    failed,
  };
}
