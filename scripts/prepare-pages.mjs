import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// GitHub Pages has no SPA rewrite rule. Give every known route an entry file.
const output = resolve("dist");
const index = resolve(output, "index.html");
const site = JSON.parse(await readFile("src/data/site.json", "utf8"));
const posts = JSON.parse(await readFile("public/content/posts.json", "utf8"));
const routes = new Set(Object.keys(site).filter((path) => path.startsWith("/") && path !== "/"));

for (const post of posts) {
  routes.add("/rg-corner/" + post.slug);
  routes.add("/" + post.slug);
}

await readFile(index); // Fail clearly if the production build has not run.
for (const route of routes) {
  if (!/^\/[a-z0-9/-]+$/i.test(route)) throw new Error("Invalid page path: " + route);
  const directory = resolve(output, "." + route);
  await mkdir(directory, { recursive: true });
  await copyFile(index, resolve(directory, "index.html"));
}

await copyFile(index, resolve(output, "404.html"));
await writeFile(resolve(output, ".nojekyll"), "");
console.log(`Prepared GitHub Pages: ${routes.size} page and article routes, plus the homepage.`);
