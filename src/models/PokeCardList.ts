import { z } from 'astro:content';

export const PokeCard = z.object({
    id: z.string(),
    localId: z.string(),
    name: z.string(),
    image: z.string(),
});