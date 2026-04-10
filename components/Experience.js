"use client";

import { useState } from "react";
import Image from "next/image";
import portfolio from "@/data/portfolio";

const Experience = () => {
  const { experience } = portfolio;
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleDropdown = (index) => {
    setOpenIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((item) => item !== index)
        : [...prevIndexes, index]
    );
  };

  const getInitials = (text) =>
    text
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  return (
    <section id="experience" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
        <div className="space-y-8">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleDropdown(index)}
              >
                <div className="flex items-center space-x-6 sm:space-x-4">
                  {exp.logo ? (
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-xl font-bold text-gray-200">
                      {getInitials(exp.company)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold">{exp.company}</h3>
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
                    <strong>Duration:</strong> {exp.period} · <strong>{exp.location}</strong>
                  </p>
                  <ul className="mt-3 space-y-2 list-disc list-inside">
                    {exp.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
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