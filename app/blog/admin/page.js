import BlogAdmin from '@/components/BlogAdmin';

export const metadata = {
  title: 'Blog Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogAdminPage() {
  return <BlogAdmin />;
}