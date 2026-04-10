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
    <section id="experience" className="py-20 bg-[var(--color-bg-secondary)] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16">
          <p className="text-[var(--color-secondary)] font-black text-sm tracking-widest uppercase mb-2">WORK</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight">Experience</h2>
        </div>

        <div className="space-y-8">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition"
            >
              <div
                className="flex justify-between items-center cursor-pointer p-8"
                onClick={() => toggleDropdown(index)}
              >
                <div className="flex items-center gap-6">
                  {exp.logo ? (
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 border-2 border-[var(--color-primary)] flex items-center justify-center font-black text-[var(--color-primary)]">
                      {getInitials(exp.company)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black">{exp.company}</h3>
                    <p className="text-[var(--color-secondary)] font-bold uppercase text-sm">{exp.role}</p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transition-transform transform font-black stroke-[var(--color-accent)] ${
                    openIndexes.includes(index) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openIndexes.includes(index) && (
                <div className="border-t-2 border-[var(--color-border)] px-8 py-6 bg-[var(--color-bg)] text-[var(--color-text-muted)]">
                  <p className="mb-4 font-bold text-white">
                    {exp.period} · <span className="text-[var(--color-primary)]">{exp.location}</span>
                  </p>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <span className="text-[var(--color-primary)] font-black">▪</span>
                        {highlight}
                      </li>
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