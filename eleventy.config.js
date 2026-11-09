import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Posts with `draft: true` are skipped entirely (not built, not listed, not in RSS/sitemap).
  eleventyConfig.addPreprocessor("drafts", "md", (data) => (data.draft ? false : undefined));

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").filter((p) => !p.data.draft).sort((a, b) => b.date - a.date)
  );

  const d = (v) => (v instanceof Date ? v : new Date(v));
  eleventyConfig.addFilter("readableDate", (v) =>
    d(v).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (v) => d(v).toISOString().slice(0, 10));
  eleventyConfig.addFilter("rfc822", (v) => d(v).toUTCString());
  eleventyConfig.addFilter("absUrl", (path, base) => base.replace(/\/$/, "") + path);
  eleventyConfig.addFilter("readingTime", (html) => {
    const text = String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const chars = text.length;
    // Korean reading pace ~500 characters/min
    return Math.max(1, Math.round(chars / 500)) + "분 읽기";
  });
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
}

export const config = {
  dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  // Cloudflare/Netlify: "/". GitHub Pages project sites: "/<slug>/".
  // Override with PATH_PREFIX env. TODO: set IDAPARTY_GH_OWNER / SITE_URL when GitHub owner is known.
  pathPrefix: process.env.PATH_PREFIX || "/slow-parent-notes/",
};
