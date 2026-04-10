import site from './site.json';
import personal from './personal.json';
import navigation from './navigation.json';
import about from './about.json';
import education from './education.json';
import experience from './experience.json';
import projects from './projects.json';
import skills from './skills.json';
import contact from './contact.json';
import { portfolioSchema } from './schema';

const rawPortfolio = {
  site,
  personal,
  navigation,
  about,
  education,
  experience,
  projects,
  skills,
  contact,
};

const parsed = portfolioSchema.safeParse(rawPortfolio);

if (!parsed.success) {
  const details = JSON.stringify(parsed.error.format(), null, 2);
  throw new Error(`Invalid portfolio data schema:\n${details}`);
}

export const validatedPortfolio = parsed.data;
