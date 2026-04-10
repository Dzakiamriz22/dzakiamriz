"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import portfolio from '@/data/portfolio';

const ITEMS_PER_PAGE = 6;

const Projects = () => {
  const { projects } = portfolio;
  const categories = useMemo(
    () => ['All', ...new Set(projects.map((project) => project.category))],
    [projects]
  );
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const visibleProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(visibleProjects.length / ITEMS_PER_PAGE));

  const pagedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return visibleProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, visibleProjects]);

  return (
    <section id="projects" className="py-20 bg-[var(--color-bg)] text-white brutal-grid">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16">
          <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase mb-2">Selected Work</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">Projects</h2>
          <p className="text-[var(--color-text-muted)] text-lg">A curated set of practical products and implementation work.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 border-2 text-xs font-black uppercase tracking-wide transition ${
                  isActive
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pagedProjects.map((project, index) => (
            <div
              key={index}
              className="border-2 border-[var(--color-border)] p-8 flex flex-col justify-between hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] transition group brutal-card fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
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
                    Open Repository ↗
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

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-wide">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border-2 border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition text-xs font-black uppercase"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 border-2 text-xs font-black transition ${
                      isActive
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                    }`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border-2 border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition text-xs font-black uppercase"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
