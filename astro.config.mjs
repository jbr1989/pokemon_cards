// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

import auth from "auth-astro";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	output: "server",
	site: "https://pokecards.jbr1989.es",
	adapter: vercel(),
	integrations: [auth(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
