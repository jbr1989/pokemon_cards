// import TCGdex from "@tcgdex/sdk";
import { PokeCardMini } from "../../models/PokeCardMini";
import { PokeCard } from "../../models/PokeCard";
import type { ApiInterface } from "./ApiInterface";
import { PokeSetMini } from "../../models/PokeSetMini";
import type { PokeSet } from "../../models/PokeSet";
import { PokeSerie } from "../../models/PokeSerie";
import { fetchWithCache } from "./ApiCache";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TCGdexAdapter implements ApiInterface {

	//#region SETS
	async PokeSet_GetAll({
		language = "en",
		getSets = false,
	}: {
		language?: string;
		getSets?: boolean;
	}): Promise<{ sets: PokeSetMini[] | null, error: string | null }> {

		try{
			
			// const tcgdex = new TCGdex(language);
			// const sets = await tcgdex.fetch("sets"); // Obtener todas las series (SerieMini)

			const sets = await fetchWithCache(language, "sets");

			if (!sets) return { sets: [], error: "Sets NOT found" }

			const pokeSets: Array<PokeSetMini> = [];

			for (const set of sets) {

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

			return { sets: pokeSets, error: null }

		} catch (e) {
			console.error("Error fetching cards from TCGdex:", e);
			return { sets: [], error: e.toString() };
		}

	}

	async PokeSet_Get({
		language = "en",
		setId = "",
	}: {
		language?: string;
		setId?: string;
	}): Promise<{ set: PokeSetMini | null, error: string | null }> {
		try {
			// const tcgdex = new TCGdex(language);
			// const set = await tcgdex.fetch("sets", setId);

			const set = await fetchWithCache(language, "sets", setId);

			// console.log("SET", set);

			if (set == null) return { set: null, error: "Set not found" };

			return { set: new PokeSetMini(
				set.id,
				set.name,
				set.logo ? `${set.logo}.webp` : "",
				set.symbol ? `${set.symbol}.webp` : "",
				set.cardCount,
			), error: null };

		} catch (e) {
			console.error("Error fetching set from TCGdex:", e);
			return { set: null, error: e.toString() };
		}
	}

	//#endregion

	//#region SERIES

	async PokeSerie_GetAll({
		language = "en",
		getSets = false,
	}: {
		language?: string;
		getSets?: boolean;
	}): Promise<{ series: PokeSerie[] | null, error: string | null }> {
		try {

			// const tcgdex = new TCGdex(language);
			// const series = await tcgdex.fetch("series"); // Obtener todas las series (SerieMini)

			const series = await fetchWithCache(language, "series");

			if (!series) return { series: [], error: "Series NOT found" }

			const pokeSeries: PokeSerie[] = [];

			for (const serie of series) {
				// const info = await tcgdex.fetch("series", serie.id); // Obtener información de la serie
				const info = await fetchWithCache(language, "series", serie.id);
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

			return { series: pokeSeries, error: null };

		} catch (e) {
			console.error("Error fetching series from TCGdex:", e);
			return { series: [], error: e.toString() };
		}
	}

	//#endregion


	//#region CARDS

	async PokeCardMini_GetAll(
		setId = "base1",
		language = "en",
	): Promise<Array<PokeCardMini> | null> {
		try {
			// const tcgdex = new TCGdex(language);
			// const selectedSet = await tcgdex.fetch("sets", setId);

			const selectedSet = await fetchWithCache(language, "sets", setId);

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
			// const tcgdex = new TCGdex(language);
			// const card = await tcgdex.fetch("cards", cardId);

			const card = await fetchWithCache(language, "cards", cardId);

			//console.log("CARD", card);

			if (!card) return null;

			return new PokeCard(
				card.id,
				card.localId,
				(card.dexId ? card.dexId[0] : null), // dexId is an array, we take the first element
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

			// console.log("DATA", data);

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

	//#endregion
}
