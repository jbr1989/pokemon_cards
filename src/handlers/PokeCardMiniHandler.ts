import { TCGdexAdapter } from '../adapters/TCGdex';
import type { PokeCardMini } from '../models/PokeCardMini';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeCardMiniHandler {

    static async getAll(language = 'en', setId = 'base1'): Promise<{ cards: Array<PokeCardMini> | null, error: string | null }> {

        let error = null;

        let cards = await TCGdexAdapter.PokeCardMini_GetAll(language, setId);
        // console.log(`CARDS ${language}`, cards?.length)

        if (cards?.length===0 && language!=='en') {
            // console.log("CARGANDO version inglesa");
            cards = await TCGdexAdapter.PokeCardMini_GetAll('en', setId);
            // console.log("CARDS ENGLISH", cards?.length)
            if (cards?.length!==0) error = "No se encontraron cartas. Cargando versión inglesa...";
        }

        // console.log("ERROR 1", error);

        return {cards, error};
    }

}