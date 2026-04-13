import BlogIndex from '@/components/BlogIndex';
import { getBlogIndexData } from '@/lib/blog';

export const metadata = {
  title: 'Blog',
  description: 'Articles, notes, and build logs about software engineering and product delivery.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  const blogData = await getBlogIndexData();

  return <BlogIndex title={blogData.title} description={blogData.description} posts={blogData.posts} />;
}