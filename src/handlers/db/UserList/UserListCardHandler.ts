import type { UserListCard } from "@/models/UserListCard";
import { TursoAdapter } from "../../../adapters/bbdd/TursoAdapter";
import { PokeHandler } from "../../PokeHandler";

export class UserListCardHandler extends PokeHandler {
	static db = new TursoAdapter();

    static async get({
        userListCardId = "0"
    }: {
        userListCardId: string
    }): Promise<{ listCard: UserListCard | null, error: string | null }> {

        if(userListCardId=="") return { listCard: null, error: "User List Card ID not found" };

        let listCard: UserListCard | null = null;
        let error: string | null = null;

        try{
            listCard = await UserListCardHandler.db.getUserListCard(userListCardId);
        }catch (e) {
            error = e.toString();
        }

        return { listCard, error };
    }

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

            if(!await UserListCardHandler.db.addOrUpdateCard(cardId, card_name, card?.dexId?.toString() || null, pokemonName || null)) {
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

    static async update({
        userListCardId = "0",
        userListId = "0",
        cardId = "0",
        cardName = "",
        lang = "en",
        variant = ""
    }: {
        userListCardId: string,
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
            //console.log("CARD", card);

            let card_name = (card!=null ? card?.name : cardName).toString().toLowerCase();
            //console.log("CARD NAME", card_name);
            let pokemonName = card_name.replace(/^(mega) /i, "").replace(/ (ex|v|vmax|v-max|vstar|v-star|v-astro)$/i, "");
            //console.log("POKEMON NAME", pokemonName);

            let listCard = await UserListCardHandler.db.getUserListCard(userListCardId);
            //console.log("LIST CARD", listCard);

            if(listCard==null) return { success: false, error: "User List Card not found" };

            if(!await UserListCardHandler.db.addOrUpdateCard(cardId, card_name, card?.dexId?.toString() || null, pokemonName || null)) {
                console.log("Card not added");
                return { success: false, error: "Card not added" };
            }

            if(!await UserListCardHandler.db.updateUserListCard(userListCardId, userListId, cardId, lang, variant)) {
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