import type { PokeCard } from "../../models/PokeCard";
import type { PokeCardMini } from "../../models/PokeCardMini";

export interface ApiInterface {
	PokeCardMini_GetAll(
		setId: string,
		language: string,
	): Promise<Array<PokeCardMini> | null>;

	PokeCard_Get(cardId: string, language: string): Promise<PokeCard | null>;
}
