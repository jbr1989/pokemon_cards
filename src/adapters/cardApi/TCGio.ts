import { PokeCard } from "@/models/PokeCard";
import type { ApiInterface } from "./ApiInterface";
import { PokeCardMini } from "@/models/PokeCardMini";

const apiKey = import.meta.env.POKEMONTCGIO_KEY;


async function fetchApi(url: string) {
    console.log("URL", url);
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": apiKey
        }
    });

    if (!response.ok) return null;

    console.log("RESPONSE", response);
    const data = await response.json();
    return data;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TCGioAdapter implements ApiInterface {
    async PokeCardMini_GetAll(setId: string, language: string): Promise<Array<PokeCardMini> | null> {

        const url = `https://api.pokemontcg.io/v2/cards?set=${setId}&language=${language}`;
        const data = await fetchApi(url);

        console.log("DATA", data);

        if (data.length === 0) return null;

        return data.map((card: any) => {
            return new PokeCardMini(
                card.id,
                "0",
                card.name,
                {
                    low: card.imageUrl,
                    high: card.imageUrl,
                }
            );
        });

    }
    async PokeCard_Get(cardId: string, language: string): Promise<PokeCard | null> {

        const url = `https://api.pokemontcg.io/v2/cards/${cardId}`;
        const data = await fetchApi(url);

        console.log("DATA", data);

        if (data.length === 0) return null;

        return new PokeCard(
            cardId,
            "0",
            data.id,
            data.name,
            data.text,
            {
                low: data.imageUrl,
                high: data.imageUrl,
            },
            undefined,
            undefined,
            undefined,
            null,
            null
        )

        throw new Error("Method not implemented.");
    }

    
}