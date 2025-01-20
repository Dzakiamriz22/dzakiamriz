'use client';

import Image from 'next/image';

const Projects = () => {
  const projects = [
    {
      title: 'Instagram Engagement Rate Calculator',
      description:
        'This web app helps users calculate Instagram engagement rates by analyzing likes, comments, and followers. It helps businesses and influencers refine their social media strategies.',
      technologies: [
        { src: '/tech-icons/html.svg', alt: 'HTML' },
        { src: '/tech-icons/tailwindcss.svg', alt: 'TailwindCSS' },
        { src: '/tech-icons/python.svg', alt: 'Python Flask' },
        { src: '/tech-icons/sqlite.svg', alt: 'SQLite' },
      ],
      link: 'https://github.com/Dzakiamriz22/Instagram-Engagement',
    },
    {
      title: 'The Ace',
      description:
        'A dynamic platform offering detailed information and streamlined registration for the Anniversary competition held by the Department of Computer Engineering at Diponegoro University.',
      technologies: [{ src: '/tech-icons/nextjs.svg', alt: 'Next.js' }],
      link: 'https://theace-2024.vercel.app/',
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
    },
    {
      title: 'Muslimku Mobile App',
      description:
        'This mobile app provides access to the Quran, prayers (Doa), and accurate prayer schedules, making it easier for Muslims to practice their faith on the go. It fetches data from a public API to ensure up-to-date information.',
      technologies: [{ src: '/tech-icons/react.svg', alt: 'React PWA' }],
      link: 'https://muslimku-one.vercel.app/',
    },
    {
      title: 'EatWise Mobile App',
      description:
        'EatWise is a mobile app designed to analyze food nutrition using machine learning models. It also includes a BMI calculator and offers personalized health tips, with an advanced API built by a specialized team.',
      technologies: [{ src: '/tech-icons/kotlin.svg', alt: 'Kotlin' }],
      link: 'https://github.com/Dzakiamriz22/EatWise',
    },
  ];

  const handleProjectClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <section id="projects" className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-semibold text-gray-100 mb-10">My Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 shadow-lg rounded-lg flex flex-col justify-between transition-all duration-300 ease-in-out hover:scale-105"
              style={{ minHeight: '420px' }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-100 mb-4">{project.title}</h3>
                <p className="text-gray-300">{project.description}</p>
              </div>

              <div className="flex justify-center flex-wrap gap-4 mb-6">
                {project.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center justify-center">
                    <Image
                      src={tech.src}
                      alt={tech.alt}
                      width={40}
                      height={40}
                      priority
                    />
                  </div>
                ))}
              </div>

              <div className="mt-auto flex justify-center">
                <button
                  onClick={() => handleProjectClick(project.link)}
                  className="px-8 py-3 rounded-full bg-gray-700 text-white text-lg font-medium transition-all duration-300 ease-in-out hover:bg-gray-600"
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