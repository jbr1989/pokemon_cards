import { TCGdexAdapter } from '../adapters/TCGdex';
import type { PokeCard } from '../models/PokeCard';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokeCardHandler {

    static async get(language = 'en', cardId = 'base1-1'): Promise<{ card: PokeCard | null, error: string | null }> {

        let error = null;

        let card = await TCGdexAdapter.PokeCard_Get(language, cardId);
        // console.log(`CARDS ${language}`, cards?.length)

        if (card==null && language!=='en') {
            // console.log("CARGANDO version inglesa");
            card = await TCGdexAdapter.PokeCard_Get('en', cardId);
            // console.log("CARDS ENGLISH", cards?.length)
            if (card!=null) error = "No se encontro la carta. Cargando versión inglesa...";
        }

        return {card, error};
    }

}