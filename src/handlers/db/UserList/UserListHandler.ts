import { TursoAdapter } from "../../../adapters/bbdd/TursoAdapter";
import type { UserList } from "../../../models/UserList";
import type { UserListCard } from "../../../models/UserListCard";
import { completeUserList } from "../../../utils/UserListUtils";
import { PokemonHandler } from "../Pokemon/PokemonHandler";
import { UserListCardHandler } from "./UserListCardHandler";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserListHandler {
	static db = new TursoAdapter();


	static async getAll({
		userId = 0
	}:{
		userId: number
	}): Promise<{ lists: UserList[]; error: string | null }> {
		let lists: UserList[] = [];
		let error: string | null = null;

		try{
			// FIND LISTS in DB
			lists = await UserListHandler.db.getUserListAll(userId);
			// console.log("LISTS", lists);
		}catch (e) {
			error = e.toString();
		}

		return { lists, error };
	}

	static async get({
		userListId = 0
	}:{
		userListId: number
	}): Promise<{ list: UserList | null; error: string | null }> {
		let list = null;
		let error: string | null = null;

		try{
			// FIND LIST in DB
			list = await UserListHandler.db.getUserList(userListId);
			// console.log("LIST", list);

			if (list!=null){
				const cards : UserListCard[] = await UserListHandler.db.getUserListCards(userListId);
				console.log("LIST CARDS", cards);
				list.cards = cards || [];
				if (list.type=="pokedex"){
					list.cards = await completeUserList(list.cards);
				}
			}
		}catch (e) {
			error = e.toString();
		}

		return { list, error };
	}

	static async add({
        userListId = "0",
        name = "",
		type = "set",
		userId = 0
    }: {
        userListId: string,
        name: string,
        type: string,
		userId: number
    }): Promise<{ success: boolean, error: string | null }> {

		if (userId==0) return { success: false, error: "User ID not found" };
		
        let success = false;
        let error: string | null = null;

        try{

			if (!await UserListHandler.db.createUserList(name, type, userId)) {
				console.log("List not added");
				return { success: false, error: "List not added" };
			}

            success = true;
        }catch (e) {
            error = e.toString();
        }

        return { success, error };
    }
}
