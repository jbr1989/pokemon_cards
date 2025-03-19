import { TCGdexAdapter } from "../adapters/cardApi/TCGdex";
import type { PokeCard } from "../models/PokeCard";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeCardHandler {
	public static adapter = new TCGdexAdapter();

	static async get({
		cardId = "base1-1",
		language = "en",
	}: {
		cardId?: string;
		language?: string;
	}): Promise<{ card: PokeCard | null; error: string | null }> {
		let error = null;

		let card = await PokeCardHandler.adapter.PokeCard_Get(cardId, language);
		// console.log(`CARDS ${language}`, cards?.length)

		if (card == null && language !== "en") {
			// console.log("CARGANDO version inglesa");
			card = await PokeCardHandler.adapter.PokeCard_Get(cardId, "en");
			// console.log("CARDS ENGLISH", cards?.length)
			if (card != null)
				error = "No se encontro la carta. Cargando versión inglesa...";
		}

		return { card, error };
	}
}
