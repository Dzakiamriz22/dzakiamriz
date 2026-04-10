"use client";

import { useEffect, useMemo, useState } from "react";
import portfolio from "@/data/portfolio";
import { useLanguage } from "@/components/LanguageProvider";
import { trackEvent } from "@/lib/analytics";

function formatDate(value, locale) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

const GitHubOverview = () => {
  const { personal } = portfolio;
  const { t, lang } = useLanguage();
  const username = useMemo(() => personal.github.split("/").filter(Boolean).pop(), [personal.github]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({
    repos: 0,
    stars: 0,
    followers: 0,
    following: 0,
    topLanguages: [],
    recentRepos: [],
  });

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(false);

        const [userRes, repoRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);

        if (!userRes.ok || !repoRes.ok) {
          throw new Error("GitHub request failed");
        }

        const userData = await userRes.json();
        const repoData = await repoRes.json();

        const repos = Array.isArray(repoData) ? repoData.filter((repo) => !repo.fork) : [];
        const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

        const languageMap = repos.reduce((acc, repo) => {
          if (!repo.language) return acc;
          acc[repo.language] = (acc[repo.language] || 0) + 1;
          return acc;
        }, {});

        const topLanguages = Object.entries(languageMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([language, count]) => ({ language, count }));

        const recentRepos = repos
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 4)
          .map((repo) => ({
            name: repo.name,
            url: repo.html_url,
            updatedAt: repo.pushed_at,
          }));

        if (!ignore) {
          setStats({
            repos: userData.public_repos || 0,
            stars,
            followers: userData.followers || 0,
            following: userData.following || 0,
            topLanguages,
            recentRepos,
          });
        }
      } catch {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [username]);

  return (
    <section id="github-overview" className="py-20 bg-[var(--color-bg-secondary)] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">{t("github.eyebrow")}</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">{t("github.title")}</h2>
            <p className="text-[var(--color-text-muted)] text-lg">{t("github.subtitle")}</p>
          </div>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-3 font-black text-sm uppercase hover:bg-[var(--color-primary)] hover:text-white transition self-start"
            onClick={() => trackEvent("github_profile_click", { url: personal.github })}
          >
            {t("github.viewProfile")} ↗
          </a>
        </div>

        {loading && <p className="text-[var(--color-text-muted)]">{t("github.loading")}</p>}
        {error && <p className="text-[var(--color-text-muted)]">{t("github.unavailable")}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <article className="border-2 border-[var(--color-border)] p-6 brutal-card">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("github.repos")}</p>
                <p className="text-4xl font-black text-[var(--color-accent)]">{stats.repos}</p>
              </article>
              <article className="border-2 border-[var(--color-border)] p-6 brutal-card">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("github.stars")}</p>
                <p className="text-4xl font-black text-[var(--color-accent)]">{stats.stars}</p>
              </article>
              <article className="border-2 border-[var(--color-border)] p-6 brutal-card">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("github.followers")}</p>
                <p className="text-4xl font-black text-[var(--color-accent)]">{stats.followers}</p>
              </article>
              <article className="border-2 border-[var(--color-border)] p-6 brutal-card">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{t("github.following")}</p>
                <p className="text-4xl font-black text-[var(--color-accent)]">{stats.following}</p>
              </article>

              <article className="border-2 border-[var(--color-border)] p-6 md:col-span-2">
                <h3 className="text-lg font-black uppercase mb-4">{t("github.topLanguages")}</h3>
                <div className="space-y-3">
                  {stats.topLanguages.map((langItem) => {
                    const max = Math.max(...stats.topLanguages.map((item) => item.count), 1);
                    const width = (langItem.count / max) * 100;
                    return (
                      <div key={langItem.language}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{langItem.language}</span>
                          <span className="text-[var(--color-text-muted)]">{langItem.count}</span>
                        </div>
                        <div className="h-2 bg-[var(--color-border)]">
                          <div className="h-full bg-[var(--color-primary)]" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>

            <aside className="border-2 border-[var(--color-border)] p-6 h-fit">
              <h3 className="text-lg font-black uppercase mb-4">{t("github.recentRepos")}</h3>
              <div className="space-y-4">
                {stats.recentRepos.map((repo) => (
                  <div key={repo.name} className="border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0">
                    <p className="font-bold text-sm break-all">{repo.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">
                      {t("github.updated")}: {formatDate(repo.updatedAt, lang === "id" ? "id-ID" : "en-GB")}
                    </p>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wide text-[var(--color-primary)] hover:text-[var(--color-accent)]"
                      onClick={() => trackEvent("github_recent_repo_click", { repo: repo.name, url: repo.url })}
                    >
                      {t("github.open")} ↗
                    </a>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default GitHubOverview;
