import TCGdex from "@tcgdex/sdk";
import { PokeSetMini } from "../models/PokeSetMini";
import { PokeHandler } from "./PokeHandler";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeSetHandler extends PokeHandler {

	static async getAll({
		language = "en",
		getSets = false,
	}: {
		language?: string;
		getSets?: boolean;
	}): Promise<{ sets: PokeSetMini[], error: string | null }> {
		// console.log("LANGUAGE", language);

		const { sets, error } = await PokeSetHandler.adapter.PokeSet_GetAll({ language, getSets });

		// console.log("SETS", sets);

		if (error) {
			console.error("Error fetching sets:", error);
			return { sets: [], error };
		}

		return { sets: sets || [], error: null };
	}

	static async get({
		language = "en",
		setId = "",
	}: {
		language?: string;
		setId?: string;
	}): Promise<{ set: PokeSetMini | null, error: string | null }> {

		const { set, error } = await PokeSetHandler.adapter.PokeSet_Get({ language, setId });

		return { set: set || null, error };
	}
}
