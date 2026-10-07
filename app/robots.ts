import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal/*", "/api/*"],
    },
    sitemap: "https://upua-30228073381.us-east1.run.app/sitemap.xml",
  };
}
