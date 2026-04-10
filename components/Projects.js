import Image from 'next/image';
import portfolio from '@/data/portfolio';

const Projects = () => {
  const { projects } = portfolio;

  return (
    <section id="projects" className="py-20 bg-[var(--color-bg)] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16">
          <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">PORTFOLIO</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">My Projects</h2>
          <p className="text-[var(--color-text-muted)] text-lg">Selected works showcasing my expertise</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border-2 border-[var(--color-border)] p-8 flex flex-col justify-between hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] transition group"
            >
              {/* Project Title */}
              <div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[var(--color-accent)] transition">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-[var(--color-text-muted)] mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Category Badge */}
                <span className="inline-block border border-[var(--color-secondary)] text-[var(--color-secondary)] px-4 py-2 font-bold text-xs uppercase mb-6">
                  {project.category}
                </span>
              </div>

              {/* Technologies */}
              <div className="flex gap-4 mb-6 flex-wrap">
                {project.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="relative w-10 h-10 group/tech">
                    <Image
                      src={tech.src}
                      alt={tech.alt}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="group-hover/tech:scale-125 transition"
                    />
                  </div>
                ))}
              </div>

              {/* View Project Button */}
              <div className="flex justify-start">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-3 font-black text-sm uppercase hover:bg-[var(--color-primary)] hover:text-white transition"
                    aria-label={`View details of ${project.title}`}
                  >
                    View Project ↗
                  </a>
                ) : (
                  <span className="border-2 border-[var(--color-border)] text-[var(--color-text-muted)] px-6 py-3 font-bold text-sm uppercase">
                    Private Project
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
