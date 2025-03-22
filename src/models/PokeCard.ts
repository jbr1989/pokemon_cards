import type { PokeSetMini } from "./PokeSetMini";

export class PokeCard {
	id: string;
	localId: string;
	name: string;
	description: string;
	image: {
		low: string | null;
		high: string | null;
	};
	category: string | null;
	illustrator: string | null;
	rarity: string | null;
	variants: {
		normal: boolean | null;
		reverse: boolean | null;
		holo: boolean | null;
		firstEdition: boolean | null;
		wPromo: boolean | null;
	};
	set: PokeSetMini | null;

	constructor(
		id: string,
		localId: string,
		name: string,
		description: string,
		image: {
			low: string | undefined;
			high: string | undefined;
		},
		category: string | undefined,
		illustrator: string | undefined,
		rarity: string | undefined,
		variants: {
			normal: boolean | undefined;
			reverse: boolean | undefined;
			holo: boolean | undefined;
			firstEdition: boolean | undefined;
			wPromo: boolean | undefined;
		},
		set: PokeSetMini | null,
	) {
		this.id = id;
		this.localId = localId;
		this.name = name;
		this.description = description;
		this.image = {
			low: image.low || null,
			high: image.high || null,
		};
		this.category = category || null;
		this.illustrator = illustrator || null;
		this.rarity = rarity || null;
		this.variants = {
			normal: variants.normal || null,
			reverse: variants.reverse || null,
			holo: variants.holo || null,
			firstEdition: variants.firstEdition || null,
			wPromo: variants.wPromo || null,
		};
		this.set = set || null;
	}
}
