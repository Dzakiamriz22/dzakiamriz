import portfolio from "@/data/portfolio";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${portfolio.personal.website}/sitemap.xml`,
    host: portfolio.personal.website,
  };
}
