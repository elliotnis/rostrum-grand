/** Resolve site files at the domain root or a GitHub Pages repository path. */
export function publicUrl(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return import.meta.env.BASE_URL + path.slice(1);
}

/** Preserve article content while resolving its local images and links. */
export function articleHtmlWithBase(html: string) {
  if (import.meta.env.BASE_URL === "/") return html;
  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("[src], [href]").forEach((element) => {
    for (const attribute of ["src", "href"]) {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, publicUrl(value));
    }
  });
  return document.body.innerHTML;
}
