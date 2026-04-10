import Image from 'next/image';
import portfolio from '@/data/portfolio';

const Contact = () => {
  const { contact } = portfolio;

  return (
    <section id="contact" className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">CONTACT</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-white">{contact.title}</h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed">
            {contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
          {contact.platforms.map(({ name, href, iconSrc, iconAlt }, index) => (
            <div key={index} className="flex flex-col items-center group">
              <a href={href} target="_blank" rel="noopener noreferrer">
                <div className="w-24 h-24 border-2 border-[var(--color-primary)] flex items-center justify-center mb-4 hover:bg-[var(--color-primary)] transition group-hover:text-white">
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    width={40}
                    height={40}
                    className="transition group-hover:invert"
                  />
                </div>
              </a>
              <p className="text-white font-bold text-sm text-center">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;