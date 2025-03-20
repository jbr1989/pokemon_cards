import { createClient } from "@libsql/client/web";

export const turso = createClient({
	url: import.meta.env.TURSO_DATABASE_URL,
	authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TursoAdapter implements BBDDInterface {
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

			console.log(result);

			return true;
		} catch (error) {
			console.log("Error al crear usuario", error);
			return false;
		}
	}
}
