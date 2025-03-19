import type { PokeSetMini } from "./PokeSetMini";

export class PokeSerie {
	id: string;
	name: string;
	logo: string;
	sets: PokeSetMini[];

	constructor(
		id: string,
		name: string,
		logo: string | undefined,
		sets: PokeSetMini[] | null,
	) {
		this.id = id;
		this.name = name;
		this.logo = logo || "";
		this.sets = sets || [];
	}

	setSets(sets: PokeSetMini[]) {
		this.sets = sets;
	}
}
