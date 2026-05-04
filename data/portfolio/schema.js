import { z } from 'zod';

const imageAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
}).strict();

export const siteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  copyrightName: z.string().min(1),
}).strict();

export const personalSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  website: z.string().url(),
  linkedin: z.string().url(),
  github: z.string().url(),
  headline: z.string().min(1),
  summary: z.string().min(1),
  heroTitlePrefix: z.string().min(1),
  profileImage: z.string().min(1).optional(),
  profileImageAlt: z.string().min(1).optional(),
}).strict();

export const navigationSchema = z.array(z.object({
  label: z.string().min(1),
  href: z.string().min(1),
}).strict()).min(1);

export const aboutSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  focus: z.string().min(1),
  techStackTitle: z.string().min(1),
  techStack: z.array(imageAssetSchema).min(1),
}).strict();

export const educationSchema = z.array(z.object({
  institution: z.string().min(1),
  location: z.string().min(1),
  degree: z.string().min(1),
  period: z.string().min(1),
  gpa: z.string().min(1),
}).strict()).min(1);

export const experienceSchema = z.array(z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  location: z.string().min(1),
  logo: z.string().min(1).optional(),
  highlights: z.array(z.string().min(1)).min(1),
}).strict()).min(1);

export const projectSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  link: z.string(),
  technologies: z.array(imageAssetSchema).min(1),
}).strict();

export const projectsSchema = z.array(projectSchema).min(1);

export const skillsSchema = z.object({
  programmingLanguages: z.array(z.string().min(1)).min(1),
  frameworksAndTools: z.array(z.string().min(1)).min(1),
  other: z.array(z.string().min(1)).min(1),
  softSkills: z.array(z.string().min(1)).min(1),
}).strict();

export const contactSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  platforms: z.array(z.object({
    name: z.string().min(1),
    href: z.string().min(1),
    iconSrc: z.string().min(1),
    iconAlt: z.string().min(1),
  }).strict()).min(1),
  spotify: z.object({
    title: z.string().min(1),
    profileUrl: z.string().url(),
    playlistEmbedUrl: z.string().url(),
  }).strict().optional(),
}).strict();

export const portfolioSchema = z.object({
  site: siteSchema,
  personal: personalSchema,
  navigation: navigationSchema,
  about: aboutSchema,
  education: educationSchema,
  experience: experienceSchema,
  projects: projectsSchema,
  skills: skillsSchema,
  contact: contactSchema,
}).strict();
