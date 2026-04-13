import { z } from 'zod';

const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  contentHtml: z.string().min(1),
  coverImage: z.string().min(1),
  coverImageAlt: z.string().min(1),
  category: z.string().min(1),
  publishedAt: z.string().min(1),
  updatedAt: z.string().min(1).optional(),
  readingMinutes: z.number().int().positive().optional(),
  seoDescription: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
  author: z.string().min(1).optional(),
}).strict();

export const blogSeedSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  posts: z.array(blogPostSchema).default([]),
}).strict();

export const blogPostInputSchema = blogPostSchema.extend({
  updatedAt: z.string().min(1).optional(),
  readingMinutes: z.number().int().positive().optional(),
  seoDescription: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
  author: z.string().min(1).optional(),
});