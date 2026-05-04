import portfolio from "@/data/portfolio";
const baseRoutes = ["", "/about", "/projects", "/contact"];

export default function sitemap() {
  const baseUrl = portfolio.personal.website;
  const now = new Date();

  const routes = baseRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
