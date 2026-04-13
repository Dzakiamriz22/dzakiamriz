import Link from 'next/link';
import Image from 'next/image';
import { getBlogIndexData } from '@/lib/blog';

function formatDate(value, locale) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export default async function BlogTeaser() {
  const blogData = await getBlogIndexData();
  const featuredPosts = blogData.posts.slice(0, 2);

  return (
    <section
      id="writing"
      className="py-14 bg-[var(--color-bg-secondary)] text-white border-t-2 border-[var(--color-border)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="max-w-3xl">
            <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">Writing</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Blog</h2>
            <p className="text-[var(--color-text-muted)] text-sm md:text-base">
              Articles, notes, and build logs about software engineering and product delivery.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-3 border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-black uppercase tracking-widest text-[10px] hover:bg-[var(--color-accent)] hover:text-black transition w-fit"
          >
            Open Blog
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <article key={post.slug} className="border-2 border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
              <div className="relative aspect-[16/9] border-b-2 border-[var(--color-border)]">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{formatDate(post.publishedAt, 'en')}</span>
                </div>

                <h3 className="text-lg font-black tracking-tight leading-tight">{post.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">{post.excerpt}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-black uppercase tracking-widest text-[10px] hover:bg-[var(--color-primary)] hover:text-black transition"
                >
                  Read article
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}