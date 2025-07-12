import TCGdex from "@tcgdex/sdk";
import { PokeCardMini } from "../../models/PokeCardMini";
import { PokeCard } from "../../models/PokeCard";
import type { ApiInterface } from "./ApiInterface";
import { PokeSetMini } from "../../models/PokeSetMini";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TCGdexAdapter implements ApiInterface {
	async PokeCardMini_GetAll(
		setId = "base1",
		language = "en",
	): Promise<Array<PokeCardMini> | null> {
		try {
			const tcgdex = new TCGdex(language);
			const selectedSet = await tcgdex.fetch("sets", setId);

			// console.log("SELECTED SET", selectedSet);

			const cards: Array<PokeCardMini> = [];
			if (!selectedSet) return cards;

			for (const card of selectedSet.cards) {
				cards.push(
					new PokeCardMini(card.id, card.localId, card.name, {
						low: card.image ? `${card.image}/low.webp` : "",
						high: card.image ? `${card.image}/high.webp` : "",
					}),
				);
			}

			return cards;
		} catch (error) {
			console.error("Error fetching cards from TCGdex:", error);
			return [];
		}
	}

	async PokeCard_Get(
		cardId: string,
		language = "en",
	): Promise<PokeCard | null> {
		try {
			const tcgdex = new TCGdex(language);
			const card = await tcgdex.fetch("cards", cardId);

			console.log("CARD", card);

			if (!card) return null;

			return new PokeCard(
				card.id,
				card.localId,
				card.name,
				card.description || "",
				{
					low: card.image ? `${card.image}/low.webp` : "",
					high: card.image ? `${card.image}/high.webp` : "",
				},
				card.category,
				card.illustrator,
				card.rarity,
				{
					normal: card.variants?.normal,
					reverse: card.variants?.reverse,
					holo: card.variants?.holo,
					firstEdition: card.variants?.firstEdition,
					wPromo: card.variants?.wPromo,
				},
				new PokeSetMini(
					card.set.id,
					card.set.name,
					card.set.logo,
					card.set.symbol,
					card.set.cardCount,
				),
			);
		} catch (error) {
			console.error("Error fetching card from TCGdex:", error);
			return null;
		}
	}

	async PokeCardMini_Find(
		name = "",
		language = "en",
	): Promise<Array<PokeCardMini> | null> {
		try {
			const url = `https://api.tcgdex.net/v2/${language}/cards?name=${name}`;

			const response = await fetch(url);
			const data = await response.json();

			console.log("DATA", data);

			// const tcgdex = new TCGdex(language);
			// const selectedSet = await tcgdex.fetch("sets", setId);

			// // console.log("SELECTED SET", selectedSet);

			const cards: Array<PokeCardMini> = [];
			if (data == null || data.length === 0) return cards;

			for (const card of data) {
				cards.push(
					new PokeCardMini(card.id, card.localId, card.name, {
						low: card.image ? `${card.image}/low.webp` : "",
						high: card.image ? `${card.image}/high.webp` : "",
					}),
				);
			}

			return cards;
		} catch (error) {
			console.error("Error fetching cards from TCGdex:", error);
			return [];
		}
	}
}
