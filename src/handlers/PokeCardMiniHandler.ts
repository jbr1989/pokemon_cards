import type { PokeCardMini } from "../models/PokeCardMini";
import { PokeHandler } from "./PokeHandler";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeCardMiniHandler extends PokeHandler {

	static async getAll({
		setId = "base1",
		language = "en",
	}: {
		setId?: string;
		language?: string;
	}): Promise<{ cards: Array<PokeCardMini> | null; error: string | null }> {
		let error = null;

		let cards = await PokeCardMiniHandler.adapter.PokeCardMini_GetAll(
			setId,
			language,
		);
		// console.log(`CARDS ${language}`, cards?.length)

		if (cards?.length === 0 && language !== "en") {
			// console.log("CARGANDO version inglesa");
			cards = await PokeCardMiniHandler.adapter.PokeCardMini_GetAll(
				setId,
				"en",
			);
			// console.log("CARDS ENGLISH", cards?.length)
			if (cards?.length !== 0)
				error = "No se encontraron cartas. Cargando versión inglesa...";
		}

		// console.log("ERROR 1", error);

		return { cards, error };
	}
}
