export class User {
	id: number;
	name: string;
	email: string;
	image: string;
	provider: string;
	providerId: string;
	createdAt: DateTime;
	updatedAt: DateTime;

	constructor(
		id: string,
		name: string,
		email: string,
		image: string | undefined,
		provider: string | undefined,
		providerAccountId: string | undefined,
	) {
		this.id = id;
		this.name = name;

		this.logo = logo || "";
		this.symbol = symbol || "";
		this.cardCount = cardCount;
	}
}
