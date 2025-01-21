'use client';

import Image from 'next/image';

const Projects = () => {
  const projects = [
    {
      title: 'Instagram Rate Calculator',
      description:
        'This web app helps users calculate Instagram engagement rates by analyzing likes, comments, and followers. It helps businesses and influencers refine their social media strategies.',
      technologies: [
        { src: '/tech-icons/html.svg', alt: 'HTML' },
        { src: '/tech-icons/tailwindcss.svg', alt: 'TailwindCSS' },
        { src: '/tech-icons/python.svg', alt: 'Python Flask' },
        { src: '/tech-icons/sqlite.svg', alt: 'SQLite' },
      ],
      link: 'https://github.com/Dzakiamriz22/Instagram-Engagement',
      category: 'Website',
    },
    {
      title: 'The Ace',
      description:
        'A dynamic platform offering detailed information and streamlined registration for the Anniversary competition held by the Department of Computer Engineering at Diponegoro University.',
      technologies: [
        { src: '/tech-icons/nextjs.svg', alt: 'Next.js' },
        { src: '/tech-icons/tailwindcss.svg', alt: 'TailwindCSS' },
      ],
      link: 'https://theace-2024.vercel.app/',
      category: 'Website',
    },
    {
      title: 'Kejar Target',
      description:
        'A website designed to help students easily find and apply for scholarship opportunities, simplifying the search for financial support for their education.',
      technologies: [
        { src: '/tech-icons/html.svg', alt: 'HTML' },
        { src: '/tech-icons/php.svg', alt: 'PHP' },
        { src: '/tech-icons/sql.svg', alt: 'SQL' },
      ],
      link: 'https://github.com/Dzakiamriz22/Kejar-Target',
      category: 'Website',
    },
    {
      title: 'Muslimku',
      description:
        'This mobile app provides access to the Quran, prayers (Doa), and accurate prayer schedules, making it easier for Muslims to practice their faith on the go. It fetches data from a public API to ensure up-to-date information.',
      technologies: [
        { src: '/tech-icons/react.svg', alt: 'React PWA' },
        { src: '/tech-icons/tailwindcss.svg', alt: 'TailwindCSS' },
      ],
      link: 'https://muslimku-one.vercel.app/',
      category: 'Web Application',
    },
    {
      title: 'EatWise',
      description:
        'EatWise is a mobile app designed to analyze food nutrition using machine learning models. It also includes a BMI calculator and offers personalized health tips, with an advanced API built by a specialized team.',
      technologies: [{ src: '/tech-icons/kotlin.svg', alt: 'Kotlin' }],
      link: 'https://github.com/Dzakiamriz22/EatWise',
      category: 'Android Application',
    },
  ];

  const handleProjectClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <section id="projects" className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-semibold text-gray-100 mb-12">My Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-xl flex flex-col justify-between transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
              style={{ minHeight: '380px' }}
            >
              {/* Project Title */}
              <h3 className="text-2xl font-semibold text-gray-100 mb-4 truncate">{project.title}</h3>

              {/* Project Description */}
              <p className="text-gray-300 text-sm mb-2 flex-grow">{project.description}</p>

              {/* Category Badge */}
              <span className="block text-xs font-medium text-gray-700 bg-gray-500 px-3 py-1 rounded-full mx-auto mt-2 mb-4">
                {project.category}
              </span>

              {/* Technologies */}
              <div className="flex justify-center gap-3 mb-6">
                {project.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center justify-center">
                    <Image
                      src={tech.src}
                      alt={tech.alt}
                      width={30}
                      height={30}
                      className="hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* View Project Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleProjectClick(project.link)}
                  className="px-8 py-3 bg-indigo-600 text-white text-sm font-medium rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-500"
                  aria-label={`View details of ${project.title}`}
                >
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
