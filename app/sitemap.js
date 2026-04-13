import portfolio from "@/data/portfolio";
import { getPublishedBlogPosts } from "@/lib/blog";

const baseRoutes = ["", "/about", "/projects", "/contact", "/blog"];

export default async function sitemap() {
  const baseUrl = portfolio.personal.website;
  const now = new Date();
  const blogPosts = await getPublishedBlogPosts();

  const routes = baseRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.8,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || now),
    changeFrequency: "monthly",
    priority: post.featured ? 0.8 : 0.7,
  }));

  return [...routes, ...blogRoutes];
}
