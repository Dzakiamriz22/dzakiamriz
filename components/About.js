import Image from 'next/image';

const About = () => {
  const techStack = [
    { src: '/tech-icons/html.svg', alt: 'HTML' },
    { src: '/tech-icons/tailwindcss.svg', alt: 'TailwindCSS' },
    { src: '/tech-icons/react.svg', alt: 'React' },
    { src: '/tech-icons/nextjs.svg', alt: 'Next.js' },
    { src: '/tech-icons/kotlin.svg', alt: 'Kotlin' },
    { src: '/tech-icons/python.svg', alt: 'Python' },
    { src: '/tech-icons/php.svg', alt: 'PHP' },
    { src: '/tech-icons/laravel.svg', alt: 'Laravel' },
    { src: '/tech-icons/sql.svg', alt: 'SQL' },
    { src: '/tech-icons/sqlite.svg', alt: 'SQLite' },
  ];

  return (
    <section id="about" className="py-16 bg-gray-900 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-gray-100">About Me</h2>
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          I am a Computer Engineering student with a passion for technology, solving real-world problems, and building impactful projects. My skills range from hardware design to full-stack software development.
        </p>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-200 mb-8">Tech Stack</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
            {techStack.map((tech, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={tech.src}
                  alt={tech.alt}
                  width={60}
                  height={60}
                  className="tech-icon transition-all duration-300 ease-in-out transform hover:scale-105"
                />
                <p className="mt-2 text-sm text-gray-300">{tech.alt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;