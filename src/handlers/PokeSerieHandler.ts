import TCGdex from "@tcgdex/sdk";
import { PokeSerie } from "../models/PokeSerie";
import { PokeSetMini } from "../models/PokeSetMini";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeSerieHandler {
	static async getAll({
		language = "en",
		getSets = false,
	}: {
		language?: string;
		getSets?: boolean;
	}): Promise<Array<PokeSerie> | null> {
		const tcgdex = new TCGdex(language);
		const series = await tcgdex.fetch("series"); // Obtener todas las series (SerieMini)

		if (!series) return null;

		const pokeSeries: Array<PokeSerie> = [];

		for (const serie of series) {
			const info = await tcgdex.fetch("series", serie.id); // Obtener información de la serie
			const pokeSets: Array<PokeSetMini> = [];

			if (info != null) {
				for (const set of info.sets) {
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
			}

			pokeSeries.push(
				new PokeSerie(serie.id, serie.name, serie.logo, pokeSets),
			);
		}

		return pokeSeries;
	}
}
