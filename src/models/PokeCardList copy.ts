import { z } from "astro:content";

export const PokeCardList = z.object({
	id: z.string(),
	localId: z.string(),
	name: z.string(),
	image: z.string(),
});

export type PokeCardList = z.infer<typeof PokeCardList>;
