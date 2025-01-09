import TCGdex from "@tcgdex/sdk";
import { PokeCardMini } from "../models/PokeCardMini";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TCGdexAdapter {

    static async PokeCardMini_GetAll(language = 'en', setId = 'base1'): Promise<Array<PokeCardMini> | null> {
        const tcgdex = new TCGdex(language);
        const selectedSet = await tcgdex.fetch('sets', setId);

        // console.log("SELECTED SET", selectedSet);

        let cards: Array<PokeCardMini> = [];
        if (!selectedSet) return cards;

        for (const card of selectedSet.cards) {
            cards.push(new PokeCardMini(card.id, card.localId, card.name, card.image));
        }

        return cards;
    }


}