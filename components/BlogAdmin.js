'use client';

import { useEffect, useMemo, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';

const emptyPost = {
  slug: '',
  title: '',
  excerpt: '',
  contentHtml: '<p></p>',
  coverImage: '/img/logo.png',
  coverImageAlt: 'Blog cover image',
  category: 'General',
  publishedAt: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString().slice(0, 10),
  readingMinutes: 1,
  seoDescription: '',
  tags: '',
  featured: false,
  status: 'published',
  author: '',
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function formatDateInput(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

export default function BlogAdmin() {
  const { t } = useLanguage();
  const [secret, setSecret] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [postForm, setPostForm] = useState(emptyPost);
  const [toolbarMode, setToolbarMode] = useState('');
  const [toolbarValue, setToolbarValue] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === selectedSlug) || null,
    [posts, selectedSlug]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write the article body here...' }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: postForm.contentHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'blog-editor min-h-[360px] focus:outline-none',
      },
    },
  });

  useEffect(() => {
    const storedSecret = window.localStorage.getItem('blog-admin-secret') || '';
    if (!storedSecret) {
      return;
    }

    setSecret(storedSecret);

    const validateStoredSecret = async () => {
      try {
        const response = await fetch('/api/blog', {
          headers: {
            'x-blog-admin-secret': storedSecret,
          },
        });

        if (!response.ok) {
          setSecret('');
          window.localStorage.removeItem('blog-admin-secret');
          return;
        }

        setIsUnlocked(true);
      } catch {
        setSecret('');
        window.localStorage.removeItem('blog-admin-secret');
      }
    };

    validateStoredSecret();
  }, []);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const loadPosts = async () => {
      setLoading(true);
      setMessage('');

      try {
        const response = await fetch('/api/blog', {
          headers: {
            'x-blog-admin-secret': secret,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load posts.');
        }

        setPosts(data.posts || []);

        if (data.posts?.length > 0) {
          setSelectedSlug((current) => current || data.posts[0].slug);
        }
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [isUnlocked, secret]);

  useEffect(() => {
    if (!editor || !selectedPost) {
      return;
    }

    setPostForm({
      ...emptyPost,
      ...selectedPost,
      publishedAt: formatDateInput(selectedPost.publishedAt),
      updatedAt: formatDateInput(selectedPost.updatedAt || selectedPost.publishedAt),
      tags: (selectedPost.tags || []).join(', '),
    });
    editor.commands.setContent(selectedPost.contentHtml || '<p></p>');
  }, [editor, selectedPost]);

  const openPost = (slug) => {
    setSelectedSlug(slug);
  };

  const startNewPost = () => {
    const draft = {
      ...emptyPost,
      slug: '',
      title: '',
      excerpt: '',
      contentHtml: '<p></p>',
      category: 'General',
      publishedAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      tags: '',
      featured: false,
      status: 'draft',
    };

    setSelectedSlug('');
    setPostForm(draft);
    editor?.commands.setContent('<p></p>');
  };

  const unlockEditor = async () => {
    try {
      const response = await fetch('/api/blog', {
        headers: {
          'x-blog-admin-secret': secret,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid admin secret.');
      }

      window.localStorage.setItem('blog-admin-secret', secret);
      setIsUnlocked(true);
      trackEvent('blog_admin_unlock', {});
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateField = (field, value) => {
    setPostForm((current) => ({ ...current, [field]: value }));
  };

  const openLinkTool = () => {
    setToolbarMode('link');
    setToolbarValue('https://');
  };

  const openImageTool = () => {
    setToolbarMode('image');
    setToolbarValue('https://');
  };

  const applyToolbarAction = () => {
    const value = toolbarValue.trim();

    const isValidUrl = /^https?:\/\//i.test(value);
    if (!isValidUrl) {
      setMessage(t('blog.invalidUrl'));
      return;
    }

    if (toolbarMode === 'link') {
      editor?.chain().focus().setLink({ href: value }).run();
      setMessage(t('blog.linkInserted'));
      setToolbarMode('');
      setToolbarValue('');
      return;
    }

    if (toolbarMode === 'image') {
      editor?.chain().focus().setImage({ src: value, alt: postForm.coverImageAlt || postForm.title || 'Blog image' }).run();
      setMessage(t('blog.imageInserted'));
      setToolbarMode('');
      setToolbarValue('');
    }
  };

  const uploadFilesToEditor = async (files) => {
    if (!files.length) {
      return;
    }

    let successCount = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', postForm.slug || slugify(postForm.title || 'blog'));

      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        headers: {
          'x-blog-admin-secret': secret,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Image upload failed.');
      }

      editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      successCount += 1;
    }

    if (successCount > 1) {
      setMessage(t('blog.uploadManySuccess').replace('{count}', String(successCount)));
      return;
    }

    setMessage(t('blog.uploadSuccess'));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';

    if (!files.length) {
      return;
    }

    try {
      await uploadFilesToEditor(files);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDropUpload = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(event.dataTransfer?.files || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) {
      return;
    }

    try {
      await uploadFilesToEditor(files);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', postForm.slug || slugify(postForm.title || 'blog'));

    try {
      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        headers: {
          'x-blog-admin-secret': secret,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cover upload failed.');
      }

      updateField('coverImage', data.url);
      if (!postForm.coverImageAlt?.trim()) {
        updateField('coverImageAlt', file.name);
      }
      setMessage(t('blog.coverUploadSuccess'));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const savePost = async () => {
    if (!editor) {
      return;
    }

    const title = postForm.title.trim();
    const slug = (postForm.slug.trim() || slugify(title)).trim();

    if (!title || !slug) {
      setMessage('Title and slug are required.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const payload = {
        ...postForm,
        slug,
        title,
        contentHtml: editor.getHTML(),
        excerpt: postForm.excerpt.trim(),
        coverImage: postForm.coverImage.trim() || '/img/logo.png',
        coverImageAlt: postForm.coverImageAlt.trim() || title,
        category: postForm.category.trim() || 'General',
        seoDescription: postForm.seoDescription.trim(),
        tags: String(postForm.tags || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        publishedAt: postForm.publishedAt,
        updatedAt: postForm.updatedAt,
        status: postForm.status,
        featured: postForm.featured,
        author: String(postForm.author || '').trim() || undefined,
      };

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-blog-admin-secret': secret,
        },
        body: JSON.stringify({ post: payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save post.');
      }

      setMessage(t('blog.saveSuccess'));
      setSelectedSlug(data.post.slug);
      setPosts((current) => {
        const next = current.filter((item) => item.slug !== data.post.slug);
        return [data.post, ...next].sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt));
      });
      setPostForm({
        ...data.post,
        tags: (data.post.tags || []).join(', '),
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!selectedPost) {
      return;
    }

    const confirmed = window.confirm(`Delete \"${selectedPost.title}\"?`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/blog?slug=${encodeURIComponent(selectedPost.slug)}`, {
        method: 'DELETE',
        headers: {
          'x-blog-admin-secret': secret,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete post.');
      }

      setMessage(t('blog.deleteSuccess'));
      setPosts((current) => current.filter((item) => item.slug !== selectedPost.slug));
      startNewPost();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!isUnlocked) {
    return (
      <section className="blog-admin-shell py-20 bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">{t('blog.eyebrow')}</p>
          <h1 className="text-5xl font-black tracking-tight mb-4">{t('blog.adminTitle')}</h1>
          <p className="text-[var(--color-text-muted)] mb-8">{t('blog.adminSubtitle')}</p>

          <div className="space-y-4 border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder={t('blog.secret')}
              className="w-full bg-[var(--color-bg)] border-2 border-[var(--color-border)] px-4 py-3 text-white placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]"
            />
            <button
              type="button"
              onClick={unlockEditor}
              className="px-5 py-3 bg-[var(--color-accent)] text-black font-black uppercase tracking-widest text-xs"
            >
              {t('blog.unlock')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-admin-shell py-20 bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">{t('blog.eyebrow')}</p>
            <h1 className="text-5xl font-black tracking-tight mb-2">{t('blog.adminTitle')}</h1>
            <p className="text-[var(--color-text-muted)]">{t('blog.adminSubtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={startNewPost} className="px-4 py-3 border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-black uppercase tracking-widest text-xs hover:bg-[var(--color-accent)] hover:text-black transition">
              {t('blog.newPost')}
            </button>
            <button type="button" onClick={savePost} disabled={saving} className="px-4 py-3 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-xs disabled:opacity-60">
              {saving ? t('blog.loading') : t('blog.savePost')}
            </button>
            {selectedPost ? (
              <button type="button" onClick={deletePost} className="px-4 py-3 border-2 border-red-500 text-red-400 font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-black transition">
                {t('blog.deletePost')}
              </button>
            ) : null}
          </div>
        </div>

        {message ? (
          <div className="mb-6 border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-[var(--color-text-muted)]">
            {message}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <aside className="border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3 border-b-2 border-[var(--color-border)] pb-3">
              <h2 className="font-black uppercase tracking-widest text-sm">Posts</h2>
              <span className="text-xs text-[var(--color-text-muted)]">{loading ? t('blog.loading') : `${posts.length} posts`}</span>
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
              {posts.map((post) => (
                <button
                  key={post.slug}
                  type="button"
                  onClick={() => openPost(post.slug)}
                  className={`w-full text-left border-2 px-4 py-3 transition ${selectedSlug === post.slug ? 'border-[var(--color-accent)] bg-[rgba(0,212,170,0.08)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">{post.category}</div>
                  <div className="font-black leading-tight">{post.title}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-2">{post.slug}</div>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{t('blog.titleField')}</span>
                <input
                  value={postForm.title}
                  onChange={(event) => {
                    const nextTitle = event.target.value;
                    updateField('title', nextTitle);
                    if (!postForm.slug || postForm.slug === slugify(postForm.title)) {
                      updateField('slug', slugify(nextTitle));
                    }
                  }}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{t('blog.slugField')}</span>
                <input
                  value={postForm.slug}
                  onChange={(event) => updateField('slug', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{t('blog.excerptField')}</span>
                <textarea
                  rows={3}
                  value={postForm.excerpt}
                  onChange={(event) => updateField('excerpt', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{t('blog.categoryField')}</span>
                <input
                  value={postForm.category}
                  onChange={(event) => updateField('category', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{t('blog.statusField')}</span>
                <select
                  value={postForm.status}
                  onChange={(event) => updateField('status', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="published">{t('blog.published')}</option>
                  <option value="draft">{t('blog.draft')}</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Published At</span>
                <input
                  type="date"
                  value={formatDateInput(postForm.publishedAt)}
                  onChange={(event) => updateField('publishedAt', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{t('blog.coverImageField')}</span>
                <input
                  value={postForm.coverImage}
                  onChange={(event) => updateField('coverImage', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
                <label className="inline-flex items-center gap-2 px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)] cursor-pointer w-fit">
                  Upload cover
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{t('blog.coverAltField')}</span>
                <input
                  value={postForm.coverImageAlt}
                  onChange={(event) => updateField('coverImageAlt', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Tags</span>
                <input
                  value={postForm.tags}
                  onChange={(event) => updateField('tags', event.target.value)}
                  placeholder="nextjs, supabase, seo"
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">SEO Description</span>
                <textarea
                  rows={3}
                  value={postForm.seoDescription}
                  onChange={(event) => updateField('seoDescription', event.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                />
              </label>
            </div>

            <div className="border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-4">
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">Bold</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">Italic</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">H2</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">H3</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">List</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">Numbered</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">Quote</button>
                <button type="button" onClick={openLinkTool} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">Link</button>
                <button type="button" onClick={openImageTool} className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)]">{t('blog.insertImage')}</button>
                <label className="px-3 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest hover:border-[var(--color-accent)] cursor-pointer">
                  {t('blog.uploadImage')}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div
                onDragEnter={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDragActive(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDragActive(false);
                }}
                onDrop={handleDropUpload}
                className={`border-2 border-dashed px-4 py-5 text-sm text-center transition ${
                  isDragActive
                    ? 'border-[var(--color-accent)] bg-[rgba(0,212,170,0.08)] text-[var(--color-text)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                {t('blog.dropzoneLabel')}
              </div>

              {toolbarMode ? (
                <div className="flex flex-col md:flex-row gap-3 border-2 border-[var(--color-border)] bg-[var(--color-bg)] p-3">
                  <input
                    value={toolbarValue}
                    onChange={(event) => setToolbarValue(event.target.value)}
                    placeholder={toolbarMode === 'link' ? 'https://example.com' : 'https://image-url.com/photo.jpg'}
                    className="flex-1 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
                  />
                  <button
                    type="button"
                    onClick={applyToolbarAction}
                    className="px-4 py-2 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-xs"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setToolbarMode('');
                      setToolbarValue('');
                    }}
                    className="px-4 py-2 border-2 border-[var(--color-border)] text-xs font-black uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}

              <div className="border-2 border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <EditorContent editor={editor} />
              </div>

              <p className="text-sm text-[var(--color-text-muted)]">{t('blog.writingTips')}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{t('blog.uploadHint')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}