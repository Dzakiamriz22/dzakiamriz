import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import portfolio from '@/data/portfolio';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/blog';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article not found',
    };
  }

  return {
    title: post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.seoDescription || post.excerpt,
      images: [post.coverImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.seoDescription || post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="blog-shell py-20 bg-[var(--color-bg)] text-[var(--color-text)]">
      <article className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="inline-flex mb-8 text-[var(--color-accent)] font-black uppercase tracking-widest text-xs">
          ← Back to blog
        </Link>

        <header className="space-y-5 mb-10">
          <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            <span>{post.category}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">{post.title}</h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-3xl">{post.excerpt}</p>

          <Link
            href="/"
            className="inline-flex items-center gap-4 border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 transition hover:border-[var(--color-accent)]"
            aria-label={`Go to ${portfolio.personal.name} portfolio homepage`}
          >
            <span className="relative h-12 w-12 overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-bg)]">
              <Image
                src={portfolio.personal.profileImage}
                alt={portfolio.personal.profileImageAlt}
                fill
                sizes="48px"
                style={{ objectFit: 'cover' }}
              />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text)]">{portfolio.personal.name}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Author profile</span>
            </span>
          </Link>
        </header>

        <div className="relative aspect-[16/9] mb-10 border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="blog-content border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 md:p-10" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {post.tags?.length ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-2 border-2 border-[var(--color-border)] text-[var(--color-text-muted)] text-xs font-black uppercase tracking-widest">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </article>
    </main>
  );
}