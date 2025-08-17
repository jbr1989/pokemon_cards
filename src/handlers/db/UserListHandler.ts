import { TursoAdapter } from "../../adapters/bbdd/TursoAdapter";
import type { UserList } from "../../models/UserList";

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
				const cards = await UserListHandler.db.getUserListCards(userListId);
				// console.log("LIST CARDS", cards);
				if (cards!=null) list.cards = cards;
			}
		}catch (e) {
			error = e.toString();
		}

		return { list, error };
	}

	// static async createUser(
	// 	name: string,
	// 	email: string,
	// 	image: string | undefined,
	// 	provider: string | undefined,
	// 	providerAccountId: string | undefined,
	// ): Promise<boolean> {
	// 	// CREATE USER in DB

	// 	const createdUser = await UserListHandler.db.createUser(
	// 		name,
	// 		email,
	// 		image,
	// 		provider,
	// 		providerAccountId,
	// 	);
	// 	return createdUser;
	// }
}
