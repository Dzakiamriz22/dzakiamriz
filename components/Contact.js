"use client";

import Image from 'next/image';
import portfolio from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';

const platformStyles = {
  WhatsApp: 'from-emerald-500/20 to-emerald-700/10 border-emerald-400/70',
  Email: 'from-sky-500/20 to-blue-700/10 border-sky-400/70',
  LinkedIn: 'from-blue-500/20 to-indigo-700/10 border-blue-400/70',
  GitHub: 'from-cyan-500/20 to-cyan-800/10 border-cyan-400/70',
  Spotify: 'from-green-500/20 to-green-700/10 border-green-400/70',
};

const platformIconFilters = {
  WhatsApp: 'invert(62%) sepia(76%) saturate(509%) hue-rotate(92deg) brightness(88%) contrast(96%)',
  Email: 'invert(49%) sepia(95%) saturate(2100%) hue-rotate(195deg) brightness(95%) contrast(92%)',
  LinkedIn: 'invert(36%) sepia(90%) saturate(1780%) hue-rotate(189deg) brightness(97%) contrast(99%)',
  GitHub: 'invert(71%) sepia(67%) saturate(532%) hue-rotate(128deg) brightness(95%) contrast(101%)',
  Spotify: 'none',
};

const Contact = () => {
  const { contact } = portfolio;
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">{t('contact.eyebrow')}</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-white">{t('contact.title')}</h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 justify-center">
          {contact.platforms.map(({ name, href, iconSrc, iconAlt }, index) => (
            <div key={index} className="flex flex-col items-center group">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('contact_platform_click', { platform: name, href })}
              >
                <div
                  className={`w-24 h-24 border-2 bg-gradient-to-br ${platformStyles[name] || 'from-[var(--color-primary)]/20 to-transparent border-[var(--color-primary)]'} flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(0,212,170,0.28)]`}
                >
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    width={40}
                    height={40}
                    className="transition duration-300 group-hover:scale-110"
                    style={{ filter: platformIconFilters[name] || 'none' }}
                  />
                </div>
              </a>
              <p className="text-white font-bold text-sm text-center tracking-wide">{name}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Contact;