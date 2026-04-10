import Image from 'next/image';
import portfolio from '@/data/portfolio';

const Projects = () => {
  const { projects } = portfolio;

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
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-indigo-600 text-white text-sm font-medium rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-500"
                    aria-label={`View details of ${project.title}`}
                  >
                    View Project
                  </a>
                ) : (
                  <span className="px-8 py-3 bg-gray-700 text-gray-300 text-sm font-medium rounded-full cursor-not-allowed">
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
