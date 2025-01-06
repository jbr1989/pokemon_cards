import TCGdex from '@tcgdex/sdk'
import { PokeCardMini } from '../models/PokeCardMini';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeCardMiniHandler {

    static async getAll(language = 'en', setId = 'base1'): Promise<Array<PokeCardMini> | null> {
        const tcgdex = new TCGdex(language);
        const selectedSet = await tcgdex.fetch('sets', setId);

        // console.log(selectedSet);

        if (!selectedSet) return null;

        let cards: Array<PokeCardMini> = [];

        for (const card of selectedSet.cards) {
            cards.push(new PokeCardMini(card.id, card.localId, card.name, card.image));
        }

        return cards;
    }

    // static async getById(language = 'en', setId = 'base1', cardLocalId: string): Promise<PokeCardList | null> {
    //     const tcgdex = new TCGdex(language);
    //     const selectedSet = await tcgdex.fetch('sets', setId, cardLocalId);

    //     if (!selectedSet) return null;

    //     for (const card of selectedSet.cards) {
    //         if (card.id === cardId) {
    //             return new PokeCardList(card.id, card.localId, card.name, card.image);
    //         }
    //     }
        
    //     return null;
    // }

}