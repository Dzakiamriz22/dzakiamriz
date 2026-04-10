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
    <section id="about" className="py-16 bg-gray-900 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-gray-100">{about.title}</h2>
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          {about.intro}
        </p>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{about.focus}</p>

        <div className="mt-12 text-left">
          <h3 className="text-2xl font-semibold text-gray-200 mb-6 text-center">Education</h3>
          <div className="grid grid-cols-1 gap-6">
            {education.map((item, index) => (
              <article key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-xl text-gray-100 font-semibold">{item.institution}</h4>
                <p className="text-gray-300 mt-1">{item.degree}</p>
                <p className="text-gray-400 mt-1">{item.period} · {item.location}</p>
                <p className="text-gray-300 mt-3">GPA: {item.gpa}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 text-left">
          <h3 className="text-2xl font-semibold text-gray-200 mb-6 text-center">Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillGroups.map((group, index) => (
              <article key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-gray-100 mb-4">{group.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-200 mb-8">{about.techStackTitle}</h3>
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
