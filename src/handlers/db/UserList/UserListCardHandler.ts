import { TursoAdapter } from "../../../adapters/bbdd/TursoAdapter";
import { PokeHandler } from "../../PokeHandler";

export class UserListCardHandler extends PokeHandler {
	static db = new TursoAdapter();

    static async add({
        userListId = "0",
        cardId = "0",
        cardName = "",
        lang = "en",
        variant = ""
    }: {
        userListId: string,
        cardId: string,
        cardName: string,
        lang: string,
        variant: string
    }): Promise<{ success: boolean, error: string | null }> {
        let success = false;
        let error: string | null = null;

        try{

            const card = await UserListCardHandler.adapter.PokeCard_Get(cardId.toString(), lang);
            console.log("CARD", card);

            let card_name = (card!=null ? card?.name : cardName).toString().toLowerCase();
            console.log("CARD NAME", card_name);
            let pokemonName = card_name.replace(/^(mega) /i, "").replace(/ (ex|v|vmax|v-max|vstar|v-star|v-astro)$/i, "");
            console.log("POKEMON NAME", pokemonName);

            if(!await UserListCardHandler.db.addCard(cardId, card_name, card?.dexId?.toString() || null, pokemonName || null)) {
                console.log("Card not added");
                return { success: false, error: "Card not added" };
            }

            if(!await UserListCardHandler.db.addUserListCard(userListId, cardId, lang, variant)) {
                console.log("Card not added");
                return { success: false, error: "Card not added" };
            }

            success = true;
        }catch (e) {
            error = e.toString();
        }

        return { success, error };
    }

    static async remove({
        userListCardId = ""
    }: {
        userListCardId: string
    }): Promise<{ success: boolean, error: string | null }> {
        let success = false;
        let error: string | null = null;

        if(userListCardId=="") return { success: false, error: "User List Card ID not found" };

        try{
            if(!await UserListCardHandler.db.removeUserListCard(userListCardId)) {
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