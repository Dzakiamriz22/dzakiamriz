create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  slug text primary key,
  title text not null,
  excerpt text not null default '',
  content_html text not null default '',
  cover_image text not null default '/img/logo.png',
  cover_image_alt text not null default '',
  category text not null default 'General',
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reading_minutes integer not null default 1,
  seo_description text not null default '',
  tags text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'published',
  author text not null default '',
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blog_posts_status_check'
  ) then
    alter table public.blog_posts
      add constraint blog_posts_status_check
      check (status in ('draft', 'published'));
  end if;
end
$$;

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts"
  on public.blog_posts
  for select
  using (status = 'published');

drop policy if exists "Service role manage blog posts" on public.blog_posts;
create policy "Service role manage blog posts"
  on public.blog_posts
  for all
  using (true)
  with check (true);

create table if not exists public.newsletter_subscribers (
  email text primary key,
  status text not null default 'active',
  subscribed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'newsletter_subscribers_status_check'
  ) then
    alter table public.newsletter_subscribers
      add constraint newsletter_subscribers_status_check
      check (status in ('active', 'unsubscribed'));
  end if;
end
$$;

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Service role manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Service role manage newsletter subscribers"
  on public.newsletter_subscribers
  for all
  using (true)
  with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

drop trigger if exists set_newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger set_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_updated_at();
