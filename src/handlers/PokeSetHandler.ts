import TCGdex from "@tcgdex/sdk";
import { PokeSetMini } from "../models/PokeSetMini";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeSetHandler {
	static async getAll({
		language = "en",
		getSets = false,
	}: {
		language?: string;
		getSets?: boolean;
	}): Promise<Array<PokeSetMini> | null> {
		const tcgdex = new TCGdex(language);
		const sets = await tcgdex.fetch("sets"); // Obtener todas las series (SerieMini)

		// console.log("SETS:", sets?.length);
		// console.log(sets);

		if (!sets) return null;

		const pokeSets: Array<PokeSetMini> = [];

		for (const set of sets) {
			//const info = await tcgdex.fetch("sets", set.id); // Obtener información de la serie
			// const pokeSets: Array<PokeSetMini> = [];

			// if (info != null) {
			// 	for (const set of info.sets) {
			// 		pokeSets.push(
			// 			new PokeSetMini(
			// 				set.id,
			// 				set.name,
			// 				set.logo,
			// 				set.symbol,
			// 				set.cardCount,
			// 			),
			// 		);
			// 	}
			// }

			pokeSets.push(
				new PokeSetMini(
					set.id,
					set.name,
					set.logo ? `${set.logo}.webp` : "",
					set.symbol ? `${set.symbol}.webp` : "",
					set.cardCount,
				),
			);
		}

		console.log(pokeSets);

		return pokeSets;
	}

	static async get({
		language = "en",
		setId = "",
	}: {
		language?: string;
		setId?: string;
	}): Promise<PokeSet | null> {
		const tcgdex = new TCGdex(language);
		const set = await tcgdex.fetch("sets", setId);

		if (set == null) return null;

		return new PokeSetMini(
			set.id,
			set.name,
			set.logo ? `${set.logo}.webp` : "",
			set.symbol ? `${set.symbol}.webp` : "",
			set.cardCount,
		);
	}
}
