import { createClient } from "@libsql/client/web";
import { UserListCard } from "../../models/UserListCard";
import { Pokemon } from "../../models/Pokemon";

export const turso = createClient({
	url: import.meta.env.TURSO_DATABASE_URL,
	authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TursoAdapter implements BBDDInterface {

	//#region POKEMON

	async getAllPokemon(): Promise<Pokemon[]> {
		try {
			const result = await turso.execute({
				sql: "SELECT * FROM pokemon", args: []
			});

			if (result.rows.length === 0) return [];

			return result.rows.map((row) => new Pokemon(row.id, row.name));
		} catch (error) {
			console.error("Error fetching pokemon:", error);
			return [];
		}
	}

	//#endregion

	//#region CARD

	async addOrUpdateCard(
		id: string,
		card_name: string,
		dexId: string | null,
		pokemon_name: string | null
	): Promise<boolean> {
		try {
			const result = await turso.execute({
				sql: "INSERT OR REPLACE INTO cards (tcgId, card_name, dexId, pokemon_name) VALUES (?, ?, ?, ?)",
				args: [id, card_name, dexId, pokemon_name],
			});

			// console.log(result);

			return true;
		} catch (error) {
			console.log("Error al crear card", error);
			return false;
		}
	}

	//#endregion

	//#region USER

	async getIdUser(
		provider: string,
		providerAccountId: string,
	): Promise<number | null> {
		const result = await turso.execute({
			sql: "SELECT id FROM users WHERE provider = ? AND provider_id = ?",
			args: [provider, providerAccountId],
		});

		if (result.rows.length === 0) return null;
		if (result.rows[0].id == null) return null;

		return Number.parseInt(result.rows[0].id.toString());
	}

	async createUser(
		name: string,
		email: string,
		image: string | undefined,
		provider: string | undefined,
		providerAccountId: string | undefined,
	): Promise<boolean> {
		try {
			const result = await turso.execute({
				sql: "INSERT INTO users (name, email, image, provider, provider_id) VALUES (?, ?, ?, ?, ?)",
				args: [
					name,
					email,
					image || null,
					provider || null,
					providerAccountId || null,
				],
			});

			//console.log(result);

			return true;
		} catch (error) {
			console.log("Error al crear usuario", error);
			return false;
		}
	}

	//#endregion

	//#region USER LIST

	async getUserListAll(
		userId: number,
	): Promise<any> {
		const result = await turso.execute({
			sql: "SELECT * FROM lists WHERE user_id = ?",
			args: [userId],
		});

		if (result.rows.length === 0) return null;

		return result.rows;
	}

	async getUserList(
		id: number,
	): Promise<any> {
		const result = await turso.execute({
			sql: "SELECT * FROM lists WHERE id = ?",
			args: [id],
		});

		if (result.rows.length === 0) return null;
		if (result.rows[0].id == null) return null;

		return result.rows[0];
	}

	async getUserListCards(
		userListId: number,
	): Promise<any> {
		const result = await turso.execute({
			sql: "SELECT * FROM lists_cards_info WHERE listId = ? ORDER BY dexId ASC",
			args: [userListId],
		});

		//console.log("GET USER LIST CARDS", result);

		if (result.rows.length === 0) return null;

		let cards: UserListCard[] = [];

		result.rows.forEach((row) => {
			cards.push(new UserListCard(
				row.id,
				row.cardId,
				row.lang,
				row.variant,
				row.stamp,
				row.foil,
				row.listId,
				row.card_name,
				row.pokemon_name,
				row.dexId,
				null
			));
		});

		return cards;
	}

	async createUserList(
		name: string,
		type: string,
		userId: number,
	): Promise<boolean> {
		try {
			const result = await turso.execute({
				sql: "INSERT INTO lists (name, type, user_id) VALUES (?, ?, ?)",
				args: [
					name,
					type,
					userId
				],
			});

			// console.log(result);

			return true;
		} catch (error) {
			console.log("Error al crear lista", error);
			return false;
		}
	}

	//#endregion

	//#region USER LIST CARD

	async getUserListCard(userListCardId: string): Promise<UserListCard | null> {
		try {
			//console.log("GET USER LIST CARD", userListCardId);

			const result = await turso.execute({
				sql: "SELECT * FROM lists_cards_info WHERE id = ?",
				args: [userListCardId],
			});

			//console.log("RESULT", result);

			if (result.length == 0) return null;

			return new UserListCard(
				result.rows[0].id,
				result.rows[0].cardId,
				result.rows[0].lang,
				result.rows[0].variant,
				result.rows[0].stamp,
				result.rows[0].foil,
				result.rows[0].listId,
				result.rows[0].card_name,
				result.rows[0].pokemon_name,
				result.rows[0].dexId,
				null
			);

		} catch (error) {
			console.log("Error al obtener cardlist", error);
			return null;
		}
	}

	async addUserListCard(
		userListId: string,
		cardId: string,
		lang: string,
		variant: string,
		stamp: string,
		foil: string
	): Promise<boolean> {
		try {

			const result = await turso.execute({
				sql: "INSERT INTO lists_cards (listId, cardId, lang, variant, stamp, foil) VALUES (?, ?, ?, ?, ?, ?)",
				args: [
					userListId,
					cardId,
					lang,
					variant,
					stamp,
					foil
				],
			});

			// console.log(result);

			return true;
		} catch (error) {
			console.log("Error al guardar carta", error);
			return false;
		}
	}

	async updateUserListCard(
		userListCardId: string,
		userListId: string,
		cardId: string,
		lang: string,
		variant: string,
		stamp: string,
		foil: string
	): Promise<boolean> {
		try {

			const result = await turso.execute({
				sql: "UPDATE lists_cards SET listId = ?, cardId = ?, lang = ?, variant = ?, stamp = ?, foil = ? WHERE id = ?",
				args: [
					userListId,
					cardId,
					lang,
					variant,
					stamp,
					foil,
					userListCardId
				],
			});

			// console.log(result);

			return true;
		} catch (error) {
			console.log("Error al actualizar carta", error);
			return false;
		}
	}

	async removeUserListCard(
		id: string
	): Promise<boolean> {
		try {

			const result = await turso.execute({
				sql: "DELETE FROM lists_cards WHERE id = ?",
				args: [id],
			});

			return true;

		} catch (error) {
			console.log("Error al eliminar carta", error);
			return false;
		}
	}

	//#endregion
}
