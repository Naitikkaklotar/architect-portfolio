import { getAllProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  const projects = getAllProjects().map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: site.url, lastModified: new Date() },
    { url: `${site.url}/projects`, lastModified: new Date() },
    { url: `${site.url}/gallery`, lastModified: new Date() },
    { url: `${site.url}/services`, lastModified: new Date() },
    { url: `${site.url}/about`, lastModified: new Date() },
    { url: `${site.url}/contact`, lastModified: new Date() },

    ...projects,
  ];
}
