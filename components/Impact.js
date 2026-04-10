"use client";

import { useLanguage } from "@/components/LanguageProvider";

const Impact = () => {
  const { t } = useLanguage();
  const items = t("impact.items");

  return (
    <section id="impact" className="py-20 bg-[var(--color-bg)] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">{t("impact.eyebrow")}</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">{t("impact.title")}</h2>
          <p className="text-[var(--color-text-muted)] text-lg">{t("impact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <article key={item.metric} className="border-2 border-[var(--color-border)] p-7 brutal-card">
              <p className="text-[var(--color-accent)] font-black text-2xl mb-3 uppercase">{item.metric}</p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
