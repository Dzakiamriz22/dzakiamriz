"use client";

import { useState } from "react";
import Image from "next/image";

const Experience = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleDropdown = (index) => {
    setOpenIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((item) => item !== index)
        : [...prevIndexes, index]
    );
  };

  const experiences = [
    {
      title: "Bangkit Academy",
      role: "Mobile Development Cohort",
      duration: "Sep 2024 - Jan 2025 (5 months)",
      location: "Remote",
      description:
        "Completed a comprehensive program led by Google, Tokopedia, Gojek, and Traveloka, specializing in mobile application development.",
      logo: "/img/bangkit.jpg",
    },
    {
      title: "Campus Data Media",
      role: "Web Developer Internship",
      duration: "Jun 2024 - Aug 2024 (3 months)",
      location: "Semarang, Jawa Tengah, Indonesia",
      description:
        "Worked on developing responsive websites and web applications, enhancing user experience and implementing modern web technologies.",
      logo: "/img/CDM.png",
    },
  ];

  return (
    <section id="experience" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleDropdown(index)}
              >
                <div className="flex items-center space-x-6 sm:space-x-4">
                  <Image
                    src={exp.logo}
                    alt={`${exp.title} Logo`}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold">{exp.title}</h3>
                    <p className="text-sm text-gray-400">{exp.role}</p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transition-transform transform ${
                    openIndexes.includes(index) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openIndexes.includes(index) && (
                <div className="mt-4 text-sm text-gray-300">
                  <p>
                    <strong>Duration:</strong> {exp.duration} · <strong>{exp.location}</strong>
                  </p>
                  <p className="mt-2">{exp.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;