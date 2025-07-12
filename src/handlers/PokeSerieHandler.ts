import { PokeSerie } from "../models/PokeSerie";
import { PokeSetMini } from "../models/PokeSetMini";
import { PokeHandler } from "./PokeHandler";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeSerieHandler extends PokeHandler {
	
	static async getAll({
		language = "en",
		getSets = false,
	}: {
		language?: string;
		getSets?: boolean;
	}): Promise<{ series: PokeSerie[] | null, error: string | null }> {

		const { series, error } = await PokeSerieHandler.adapter.PokeSerie_GetAll({ language, getSets });

		return { series, error };
	}
}
