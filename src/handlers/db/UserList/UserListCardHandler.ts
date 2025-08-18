import { TursoAdapter } from "../../../adapters/bbdd/TursoAdapter";
import { PokeHandler } from "../../PokeHandler";

export class UserListCardHandler extends PokeHandler {
	static db = new TursoAdapter();

    static async add({
        userListId = "0",
        cardId = "0",
        lang = "en"
    }: {
        userListId: string,
        cardId: string,
        lang: string
    }): Promise<{ success: boolean, error: string | null }> {
        let success = false;
        let error: string | null = null;

        try{

            const card = await UserListCardHandler.adapter.PokeCard_Get(cardId.toString(), lang);
            console.log("CARD", card);

            let pokemonName = card?.name?.toLowerCase().replace(/\s(?:ex|vmax)$/i, "");

            if(!await UserListCardHandler.db.addCard(cardId, card?.name?.toLowerCase() || "", card?.dexId?.toString() || null, pokemonName || null)) {
                console.log("Card not added");
                return { success: false, error: "Card not added" };
            }

            if(!await UserListCardHandler.db.addUserListCard(userListId, cardId, lang)) {
                console.log("Card not added");
                return { success: false, error: "Card not added" };
            }

            success = true;
        }catch (e) {
            error = e.toString();
        }

        return { success, error };
    }

}