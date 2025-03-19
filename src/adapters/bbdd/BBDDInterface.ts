interface BBDDInterface {
	getIdUser(
		provider: string,
		providerAccountId: string,
	): Promise<number | null>;

	// getUser(id: string): Promise<any>;
	// getUserByEmail(email: string): Promise<any>;

	createUser(
		name: string,
		email: string,
		image: string | undefined,
		provider: string | undefined,
		providerAccountId: string | undefined,
	): Promise<boolean>;

	// updateUser(id: string, user: any): Promise<any>;
	// deleteUser(id: string): Promise<any>;
}
