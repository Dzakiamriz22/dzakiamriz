import portfolio from "@/data/portfolio";

const routes = ["", "/about", "/projects", "/contact"];

export default function sitemap() {
  const baseUrl = portfolio.personal.website;
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
