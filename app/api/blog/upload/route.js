import { NextResponse } from 'next/server';
import { uploadBlogAsset } from '@/lib/blog';

function isAuthorized(request) {
  const secret = request.headers.get('x-blog-admin-secret');
  return Boolean(secret && secret === process.env.BLOG_ADMIN_SECRET);
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slug = formData.get('slug');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    const url = await uploadBlogAsset(file, typeof slug === 'string' ? slug : 'blog');
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to upload image.' }, { status: 400 });
  }
}