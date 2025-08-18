import { TursoAdapter } from "../../../adapters/bbdd/TursoAdapter";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserHandler {
	static db = new TursoAdapter();

	static async getIdUser(
		provider: string,
		providerAccountId: string,
	): Promise<number | null> {
		// FIND USER in DB
		const userId = await UserHandler.db.getIdUser(provider, providerAccountId);
		if (userId != null) return userId;

		return null;
	}

	static async createUser(
		name: string,
		email: string,
		image: string | undefined,
		provider: string | undefined,
		providerAccountId: string | undefined,
	): Promise<boolean> {
		// CREATE USER in DB

		const createdUser = await UserHandler.db.createUser(
			name,
			email,
			image,
			provider,
			providerAccountId,
		);
		return createdUser;
	}
}
