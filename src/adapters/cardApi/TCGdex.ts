import TCGdex from "@tcgdex/sdk";
import { PokeCardMini } from "../../models/PokeCardMini";
import { PokeCard } from "../../models/PokeCard";
import type { ApiInterface } from "./ApiInterface";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TCGdexAdapter implements ApiInterface {
	async PokeCardMini_GetAll(
		setId = "base1",
		language = "en",
	): Promise<Array<PokeCardMini> | null> {
		const tcgdex = new TCGdex(language);
		const selectedSet = await tcgdex.fetch("sets", setId);

		// console.log("SELECTED SET", selectedSet);

		const cards: Array<PokeCardMini> = [];
		if (!selectedSet) return cards;

		for (const card of selectedSet.cards) {
			cards.push(
				new PokeCardMini(card.id, card.localId, card.name, card.image),
			);
		}

		return cards;
	}

	async PokeCard_Get(
		cardId: string,
		language = "en",
	): Promise<PokeCard | null> {
		const tcgdex = new TCGdex(language);
		const card = await tcgdex.fetch("cards", cardId);

		if (!card) return null;

		return new PokeCard(
			card.id,
			card.localId,
			card.name,
			card.image,
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
		);
	}
}
