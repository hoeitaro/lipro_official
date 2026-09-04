// plugins/GenerateSitemapPlugin.js
import fs from "fs";
import path from "path";

export default class GenerateSitemapPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap("GenerateSitemapPlugin", () => {
      const { outputPath = "dist/assets", baseUrl = "https://example.com", routes = [] } = this.options;

      const sitemapXml = this.generateSitemapXml(baseUrl, routes);
      const fullOutputPath = path.resolve(outputPath, "sitemap.xml");

      fs.mkdirSync(path.dirname(fullOutputPath), { recursive: true });
      fs.writeFileSync(fullOutputPath, sitemapXml, "utf8");

      console.log("✅ sitemap.xml を出力しました →", fullOutputPath);
    });
  }

  generateSitemapXml(baseUrl, routes) {
    const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const footer = `</urlset>`;
    const body = routes
      .map((route) => {
        return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route.changefreq || "monthly"}</changefreq>
    <priority>${route.priority ?? 0.5}</priority>
  </url>`;
      })
      .join("\n");

    return header + body + "\n" + footer;
  }
}
