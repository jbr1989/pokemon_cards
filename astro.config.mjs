// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

import auth from "auth-astro";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://pokecards.jbr1989.es",
	output: "server",
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	integrations: [auth(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
