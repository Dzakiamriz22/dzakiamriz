'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';

function formatDate(value, locale) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function getPopularityScore(post) {
  const freshnessDays = Math.max(
    1,
    Math.ceil((Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  return (post.featured ? 120 : 0) + post.readingMinutes * 8 + (post.tags?.length || 0) * 4 - freshnessDays * 0.15;
}

function ReadingRing({ minutes }) {
  const percentage = Math.min(100, Math.max(8, Math.round((minutes / 12) * 100)));

  return (
    <div
      className="reading-ring"
      style={{
        background: `conic-gradient(var(--color-accent) ${percentage}%, rgba(71, 85, 105, 0.2) ${percentage}% 100%)`,
      }}
      aria-label={`${minutes} minute read estimate`}
    >
      <div className="reading-ring-inner">
        <span>{minutes}m</span>
      </div>
    </div>
  );
}

export default function BlogIndex({ title, description, posts }) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(t('blog.allCategories'));
  const [activeFeed, setActiveFeed] = useState('latest');
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const featuredPost = useMemo(() => posts.find((post) => post.featured) || posts[0] || null, [posts]);
  const stats = useMemo(() => {
    const categoryCount = new Set(posts.map((post) => post.category)).size;
    const avgRead = posts.length
      ? Math.max(1, Math.round(posts.reduce((total, post) => total + (post.readingMinutes || 1), 0) / posts.length))
      : 0;
    const newestPost = [...posts].sort(
      (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    )[0];

    const fullStats = [
      {
        label: t('blog.statsArticles'),
        value: posts.length,
        suffix: t('blog.statsUnitArticles'),
      },
      {
        label: t('blog.statsCategories'),
        value: categoryCount,
        suffix: t('blog.statsUnitCategories'),
      },
      {
        label: t('blog.statsAvgRead'),
        value: avgRead,
        suffix: t('blog.statsUnitMinutes'),
      },
      {
        label: t('blog.statsLastUpdate'),
        value: newestPost ? formatDate(newestPost.publishedAt, lang) : '-',
        suffix: '',
      },
    ];

    if (posts.length <= 1) {
      return [fullStats[0], fullStats[3]];
    }

    return fullStats;
  }, [posts, t, lang]);

  useEffect(() => {
    setActiveCategory(t('blog.allCategories'));
  }, [t]);

  const feedPosts = useMemo(() => {
    if (activeFeed === 'popular') {
      return [...posts].sort((left, right) => getPopularityScore(right) - getPopularityScore(left));
    }

    return [...posts].sort(
      (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    );
  }, [activeFeed, posts]);

  const categories = useMemo(() => {
    return [t('blog.allCategories'), ...new Set(feedPosts.map((post) => post.category))];
  }, [feedPosts, t]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return feedPosts.filter((post) => {
      const matchesCategory = activeCategory === t('blog.allCategories') || post.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        [post.title, post.excerpt, post.category, ...(post.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, feedPosts, query, t]);

  const listPosts = useMemo(() => {
    if (!featuredPost) {
      return filteredPosts;
    }

    return filteredPosts.filter((post) => post.slug !== featuredPost.slug);
  }, [featuredPost, filteredPosts]);

  const handleSubscribe = (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setSubscribeMessage(t('blog.subscribeInvalid'));
      return;
    }

    trackEvent('blog_subscribe_intent', {
      domain: cleanEmail.split('@')[1] || 'unknown',
    });

    setIsSubscribing(true);
    fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || t('blog.subscribeFailed'));
        }

        setSubscribeMessage(data.message || t('blog.subscribeSuccess'));
        setEmail('');
      })
      .catch((error) => {
        setSubscribeMessage(error.message || t('blog.subscribeFailed'));
      })
      .finally(() => {
        setIsSubscribing(false);
      });
  };

  return (
    <section className="blog-shell py-20 bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="blog-hero-panel mb-14 relative overflow-hidden">
          <div className="blog-hero-orb blog-hero-orb-a" />
          <div className="blog-hero-orb blog-hero-orb-b" />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
            <div className="space-y-5">
              <p className="text-[var(--color-primary)] font-black text-xs tracking-[0.22em] uppercase">{t('blog.eyebrow')}</p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.02]">{title}</h1>
              <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl">{description}</p>

              <div className="blog-kicker-inline">
                <span>{t('blog.heroKicker')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <article key={item.label} className="blog-stat-tile">
                  <p className="blog-stat-label">{item.label}</p>
                  <p className="blog-stat-value">{item.value}</p>
                  {item.suffix ? <p className="blog-stat-suffix">{item.suffix}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </div>

        {featuredPost ? (
          <article className="blog-featured-spotlight mb-12 overflow-hidden">
            <div className="relative aspect-[21/9] border-b border-[var(--color-border)]">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.coverImageAlt}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] p-6 md:p-8 items-start">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-black text-[var(--color-primary)] mb-3">{t('blog.featuredStoryLabel')}</p>
                <h2 className="text-3xl md:text-4xl font-black leading-[1.05] mb-3">{featuredPost.title}</h2>
                <p className="text-[var(--color-text-muted)] max-w-2xl">{featuredPost.excerpt}</p>
              </div>

              <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:p-5">
                <p className="text-sm text-[var(--color-text-muted)] mb-4">{t('blog.featuredStoryCopy')}</p>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] font-black text-[var(--color-text-muted)] mb-4">
                  <span>{featuredPost.category}</span>
                  <span>{formatDate(featuredPost.publishedAt, lang)}</span>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-black uppercase tracking-widest text-xs hover:bg-[var(--color-primary)] hover:text-white transition"
                >
                  {t('blog.readMore')}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        ) : null}

        {posts.length > 1 ? (
          <>
            <div className="blog-feed-toolbar flex flex-wrap items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setActiveFeed('latest')}
                className={`px-4 py-2 border-2 text-xs font-black uppercase tracking-widest transition ${
                  activeFeed === 'latest'
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {t('blog.feedLatest')}
              </button>
              <button
                type="button"
                onClick={() => setActiveFeed('popular')}
                className={`px-4 py-2 border-2 text-xs font-black uppercase tracking-widest transition ${
                  activeFeed === 'popular'
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {t('blog.feedPopular')}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.6fr_1fr] mb-10">
              <label className="block">
                <span className="sr-only">{t('blog.search')}</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('blog.search')}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-5 py-4 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] outline-none transition"
                />
              </label>

              <div className="flex flex-wrap gap-3 md:justify-end items-center">
                {categories.map((category) => {
                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setActiveCategory(category);
                        trackEvent('blog_filter', { category });
                      }}
                      className={`px-4 py-2 border-2 font-black uppercase text-xs tracking-widest transition ${
                        isActive
                          ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {listPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`blog-card border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden flex flex-col h-full ${
                index === 0 ? 'xl:col-span-2' : ''
              }`}
            >
              <div className="relative aspect-[16/10] border-b-2 border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  fill
                  sizes="(max-width: 1280px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                {post.featured ? (
                    <span className="absolute top-4 left-4 bg-[var(--color-accent)] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-2">
                    {t('blog.featured')}
                  </span>
                ) : null}
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex flex-wrap gap-2 text-[11px] font-black tracking-[0.18em] uppercase text-[var(--color-text-muted)]">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{formatDate(post.publishedAt, lang)}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="space-y-2 flex-1">
                    <h2 className="text-2xl font-black leading-tight">{post.title}</h2>
                    <p className="text-[var(--color-text-muted)]">{post.excerpt}</p>
                  </div>
                  <ReadingRing minutes={post.readingMinutes || 1} />
                </div>

                {post.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-[0.16em] px-2 py-1 border border-[var(--color-border)] text-[var(--color-text-muted)]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-auto pt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={() => trackEvent('blog_open', { slug: post.slug })}
                    className="inline-flex items-center gap-2 px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-black uppercase tracking-widest text-xs hover:bg-[var(--color-primary)] hover:text-white transition"
                  >
                    {t('blog.readMore')}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {listPosts.length === 0 && !featuredPost ? (
          <div className="mt-12 border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-[var(--color-text-muted)]">
            {t('blog.empty')}
          </div>
        ) : null}

        <div className="blog-newsletter-panel mt-16 border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[var(--color-primary)] font-black text-xs uppercase tracking-[0.18em] mb-2">{t('blog.newsletterEyebrow')}</p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{t('blog.newsletterTitle')}</h3>
              <p className="text-[var(--color-text-muted)]">
                {t('blog.newsletterBody')}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] font-black text-[var(--color-text-muted)] mt-5">{t('blog.newsletterTrust')}</p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (subscribeMessage) {
                    setSubscribeMessage('');
                  }
                }}
                placeholder="you@company.com"
                className="w-full bg-[var(--color-bg)] border-2 border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full md:w-fit px-5 py-3 bg-[var(--color-primary)] text-white font-black uppercase tracking-widest text-xs hover:opacity-90 transition"
              >
                {isSubscribing ? t('blog.subscribing') : t('blog.subscribeCta')}
              </button>
              {subscribeMessage ? (
                <p className="text-sm text-[var(--color-text-muted)]">{subscribeMessage}</p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}