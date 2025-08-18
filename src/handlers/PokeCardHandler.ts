import type { PokeCard } from "../models/PokeCard";
import type { PokeCardMini } from "../models/PokeCardMini";
import { PokeHandler } from "./PokeHandler";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeCardHandler extends PokeHandler {

	static async getAll({
		name = "",
		language = "en",
	}: {
		name?: string;
		language?: string;
	}): Promise<{ cards: PokeCardMini[] | null; error: string | null }> {
		const error = null;

		const cards = await PokeCardHandler.adapter.PokeCardMini_GetAll(
			name,
			language,
		);

		return { cards, error };
	}

	static async get({
		cardId = "base1-1",
		language = "en",
	}: {
		cardId?: string;
		language?: string;
	}): Promise<{ card: PokeCard | null; error: string | null }> {
		if (cardId==null || cardId=="") return { card: null, error: "Card ID not found" };

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

	static async find({
		name = "",
		language = "en",
	}: {
		name?: string;
		language?: string;
	}): Promise<{ cards: PokeCardMini[] | null; error: string | null }> {
		const error = null;

		const cards = await PokeCardHandler.adapter.PokeCardMini_Find(
			name,
			language,
		);

		return { cards, error };
	}
}
