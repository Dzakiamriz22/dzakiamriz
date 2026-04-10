import Image from 'next/image';
import portfolio from '@/data/portfolio';

const About = () => {
  const { about, education, skills } = portfolio;
  const skillGroups = [
    { title: 'Programming Languages', items: skills.programmingLanguages },
    { title: 'Frameworks & Tools', items: skills.frameworksAndTools },
    { title: 'Other', items: skills.other },
    { title: 'Soft Skills', items: skills.softSkills },
  ];

  return (
    <section id="about" className="py-20 bg-[var(--color-bg)] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16">
          <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">PROFILE</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight">{about.title}</h2>
        </div>

        {/* Intro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2 border-l-4 border-[var(--color-primary)] pl-8">
            <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-4">
              {about.intro}
            </p>
            <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
              {about.focus}
            </p>
          </div>
        </div>

        {/* Education */}
        <div className="mb-16">
          <h3 className="text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
            <span className="text-[var(--color-secondary)]">━━</span>
            Education
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {education.map((item, index) => (
              <article key={index} className="border-2 border-[var(--color-border)] p-8 hover:border-[var(--color-primary)] transition">
                <h4 className="text-2xl font-black text-white mb-2">{item.institution}</h4>
                <p className="text-[var(--color-secondary)] font-bold text-lg mb-2">{item.degree}</p>
                <p className="text-[var(--color-text-muted)] mb-4">{item.period} · {item.location}</p>
                <p className="text-[var(--color-primary)] font-bold">GPA: {item.gpa}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h3 className="text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
            <span className="text-[var(--color-secondary)]">━━</span>
            Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillGroups.map((group, index) => (
              <article key={index} className="border-2 border-[var(--color-border)] p-8">
                <h4 className="text-xl font-black text-white mb-6 uppercase">{group.title}</h4>
                <div className="flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <span key={item} className="px-4 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm uppercase hover:bg-[var(--color-primary)] hover:text-white transition">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tight text-center mb-12 flex items-center justify-center gap-4">
            <span className="text-[var(--color-secondary)]">━━</span>
            {about.techStackTitle}
            <span className="text-[var(--color-secondary)]">━━</span>
          </h3>
          <div className="flex justify-center items-center flex-wrap gap-8">
            {about.techStack.map((tech, index) => (
              <div key={index} className="flex flex-col items-center group">
                <Image
                  src={tech.src}
                  alt={tech.alt}
                  width={80}
                  height={80}
                  className="tech-icon transition-all duration-300 ease-in-out transform group-hover:scale-110"
                />
                <p className="mt-2 text-sm text-gray-300 group-hover:text-gray-100">{tech.alt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
