import { blogSeedSchema } from './schema';
import rawBlogSeed from './seed.json';

const parsed = blogSeedSchema.safeParse(rawBlogSeed);

if (!parsed.success) {
  const details = JSON.stringify(parsed.error.format(), null, 2);
  throw new Error(`Invalid blog seed data schema:\n${details}`);
}

export const blogSeed = parsed.data;

export default blogSeed;