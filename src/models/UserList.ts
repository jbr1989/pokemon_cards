import type { UserListCard } from "./UserListCard";

export class UserList {
	id: number;
    userId: number;
	name: string;
    cards: UserListCard[] | null;

	constructor(
		id: number,
        userId: number,
		name: string,
		cards: UserListCard[] | null,
	) {
		this.id = id;
        this.userId = userId;
		this.name = name;

        this.cards = cards || [];
	}
}
