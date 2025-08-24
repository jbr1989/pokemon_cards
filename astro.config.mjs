// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";
import path from "path";

import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
	site: "https://pokecards.jbr1989.es",
	output: "server",
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	integrations: [auth()],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve("./src"),
			},
		},
	},
});
