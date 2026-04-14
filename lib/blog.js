import 'server-only';

import portfolio from '@/data/portfolio';
import blogSeed from '@/data/blog';
import { createSupabaseAdminClient, hasSupabaseConfig } from '@/lib/supabase';

const BLOG_TABLE = 'blog_posts';
const BLOG_STORAGE_BUCKET = process.env.SUPABASE_BLOG_STORAGE_BUCKET || 'blog-assets';

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function estimateReadingMinutes(contentHtml) {
  const words = stripHtml(contentHtml).split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function sortPosts(posts) {
  return [...posts].sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt));
}

export function normalizeBlogPost(row) {
  const contentHtml = row.contentHtml ?? row.content_html ?? '';
  const publishedAt = row.publishedAt ?? row.published_at ?? new Date().toISOString();
  const updatedAt = row.updatedAt ?? row.updated_at ?? publishedAt;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    contentHtml,
    coverImage: row.coverImage ?? row.cover_image ?? '/img/logo.png',
    coverImageAlt: row.coverImageAlt ?? row.cover_image_alt ?? row.title,
    category: row.category ?? 'General',
    publishedAt,
    updatedAt,
    readingMinutes: row.readingMinutes ?? row.reading_minutes ?? estimateReadingMinutes(contentHtml),
    seoDescription: row.seoDescription ?? row.seo_description ?? row.excerpt ?? '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    featured: Boolean(row.featured),
    status: row.status ?? 'published',
    author: row.author ?? portfolio.personal.name,
  };
}

function toStorageRow(post) {
  const now = new Date().toISOString();
  const contentHtml = post.contentHtml ?? '';

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    content_html: contentHtml,
    cover_image: post.coverImage ?? '/img/logo.png',
    cover_image_alt: post.coverImageAlt ?? post.title,
    category: post.category ?? 'General',
    published_at: post.publishedAt ?? now,
    updated_at: post.updatedAt ?? now,
    reading_minutes: post.readingMinutes ?? estimateReadingMinutes(contentHtml),
    seo_description: post.seoDescription ?? post.excerpt ?? '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    featured: Boolean(post.featured),
    status: post.status ?? 'published',
    author: post.author ?? portfolio.personal.name,
  };
}

function getSeedPosts() {
  return sortPosts(blogSeed.posts.map(normalizeBlogPost));
}

function getAdminClient() {
  return createSupabaseAdminClient();
}

export async function getBlogIndexData() {
  if (!hasSupabaseConfig()) {
    return {
      title: blogSeed.title,
      description: blogSeed.description,
      posts: getSeedPosts(),
      source: 'seed',
    };
  }

  const client = getAdminClient();

  if (!client) {
    return {
      title: blogSeed.title,
      description: blogSeed.description,
      posts: getSeedPosts(),
      source: 'seed',
    };
  }

  const { data, error } = await client
    .from(BLOG_TABLE)
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !data) {
    console.error('[blog] Unable to load posts from Supabase:', error?.message || 'Unknown error');
    return {
      title: blogSeed.title,
      description: blogSeed.description,
      posts: [],
      source: 'supabase-error',
    };
  }

  const posts = data.map(normalizeBlogPost);

  return {
    title: blogSeed.title,
    description: blogSeed.description,
    posts: sortPosts(posts),
    source: 'supabase',
  };
}

export async function getPublishedBlogPosts() {
  const blogData = await getBlogIndexData();
  return blogData.posts;
}

export async function getBlogPostBySlug(slug) {
  if (!slug) {
    return null;
  }

  if (!hasSupabaseConfig()) {
    return getSeedPosts().find((post) => post.slug === slug) ?? null;
  }

  const client = getAdminClient();

  if (!client) {
    return getSeedPosts().find((post) => post.slug === slug) ?? null;
  }

  const { data, error } = await client
    .from(BLOG_TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    return getSeedPosts().find((post) => post.slug === slug) ?? null;
  }

  if (!data) {
    return null;
  }

  return normalizeBlogPost(data);
}

export async function listAdminBlogPosts() {
  if (!hasSupabaseConfig()) {
    return getSeedPosts();
  }

  const client = getAdminClient();

  if (!client) {
    return getSeedPosts();
  }

  const { data, error } = await client
    .from(BLOG_TABLE)
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    return getSeedPosts();
  }

  if (!data) {
    return [];
  }

  return sortPosts(data.map(normalizeBlogPost));
}

export async function getAdminBlogPostBySlug(slug) {
  if (!slug) {
    return null;
  }

  if (!hasSupabaseConfig()) {
    return getSeedPosts().find((post) => post.slug === slug) ?? null;
  }

  const client = getAdminClient();

  if (!client) {
    return getSeedPosts().find((post) => post.slug === slug) ?? null;
  }

  const { data, error } = await client
    .from(BLOG_TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeBlogPost(data);
}

export async function upsertBlogPost(post) {
  const client = getAdminClient();

  if (!client) {
    throw new Error('Supabase is not configured for blog writes.');
  }

  const payload = toStorageRow({
    ...post,
    updatedAt: new Date().toISOString(),
  });

  const { data, error } = await client
    .from(BLOG_TABLE)
    .upsert(payload, { onConflict: 'slug' })
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeBlogPost(data) : normalizeBlogPost(payload);
}

export async function deleteBlogPost(slug) {
  const client = getAdminClient();

  if (!client) {
    throw new Error('Supabase is not configured for blog writes.');
  }

  const { error } = await client.from(BLOG_TABLE).delete().eq('slug', slug);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function uploadBlogAsset(file, slug) {
  const client = getAdminClient();

  if (!client) {
    throw new Error('Supabase is not configured for blog uploads.');
  }

  const fileName = file.name || 'upload';
  const extension = fileName.includes('.') ? fileName.split('.').pop() : 'png';
  const safeSlug = slug || 'blog';
  const path = `${safeSlug}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await client.storage.from(BLOG_STORAGE_BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = client.storage.from(BLOG_STORAGE_BUCKET).getPublicUrl(path);

  return data.publicUrl;
}