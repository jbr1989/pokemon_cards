// src/pages/sitemap.xml.js
import { PokeSetHandler } from "../handlers/PokeSetHandler";

function createUrl(
	url,
	lastModified = new Date().toISOString(),
	priority = 1.0,
) {
	return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastModified}</lastmod>
      <priority>${priority}</priority>
    </url>
    `;
}

export async function GET() {
	try {
		const dominio = "https://pokecards.jbr1989.es/";

		// Genera el contenido del sitemap
		let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

		// PÁGINAS ESTÁTICAS
		sitemapContent += createUrl(dominio);
		sitemapContent += createUrl(`${dominio}about`);
		sitemapContent += createUrl(`${dominio}explore`);
		sitemapContent += createUrl(`${dominio}you`);

		// PÁGINAS DINÁMICAS

		// Sets
		const sets = await PokeSetHandler.getAll({ language: "en" });

		for (const set of sets || []) {
			sitemapContent += createUrl(`${dominio}set/${set.id}`);
		}

		sitemapContent += "</urlset>";

		return new Response(sitemapContent, {
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=0, must-revalidate",
			},
		});
	} catch (error) {
		return new Response(`Error generando sitemap: ${error.message}`, {
			status: 500,
			headers: {
				"Content-Type": "text/plain",
			},
		});
	}
}
