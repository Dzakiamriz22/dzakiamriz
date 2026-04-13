import { NextResponse } from 'next/server';
import { blogPostInputSchema } from '@/data/blog/schema';
import {
  deleteBlogPost,
  getAdminBlogPostBySlug,
  listAdminBlogPosts,
  getPublishedBlogPosts,
  upsertBlogPost,
} from '@/lib/blog';
import { notifyBlogSubscribers } from '@/lib/newsletter';

function isAuthorized(request) {
  const secret = request.headers.get('x-blog-admin-secret');
  return Boolean(secret && secret === process.env.BLOG_ADMIN_SECRET);
}

export async function GET(request) {
  try {
    const hasSecretHeader = request.headers.has('x-blog-admin-secret');

    if (hasSecretHeader && !isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (isAuthorized(request)) {
      const posts = await listAdminBlogPosts();
      return NextResponse.json({ posts });
    }

    const posts = await getPublishedBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to load posts.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rawPost = body.post ?? body;
    const normalizedPost = {
      ...rawPost,
      author: typeof rawPost.author === 'string' && rawPost.author.trim() === ''
        ? undefined
        : rawPost.author,
    };
    const previousPost = normalizedPost.slug
      ? await getAdminBlogPostBySlug(normalizedPost.slug)
      : null;
    const post = blogPostInputSchema.parse(normalizedPost);
    const savedPost = await upsertBlogPost(post);

    const shouldNotify = (() => {
      if (savedPost.status !== 'published') {
        return false;
      }

      if (!previousPost) {
        return true;
      }

      if (previousPost.status !== 'published') {
        return true;
      }

      return (
        previousPost.title !== savedPost.title
        || previousPost.excerpt !== savedPost.excerpt
        || previousPost.contentHtml !== savedPost.contentHtml
        || previousPost.coverImage !== savedPost.coverImage
      );
    })();

    const notification = shouldNotify
      ? await notifyBlogSubscribers(savedPost)
      : { attempted: 0, sent: 0, skipped: true, reason: 'no-meaningful-change' };

    return NextResponse.json({ post: savedPost, notification });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to save post.' }, { status: 400 });
  }
}

export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
    }

    await deleteBlogPost(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to delete post.' }, { status: 400 });
  }
}