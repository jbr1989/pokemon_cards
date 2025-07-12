export class UserListCard {
	id: number;
    userListId: number;
    cardId: string;
    lang: string;



	constructor(
		id: number,
		userListId: number,
		cardId: string,
        lang: string
	) {
		this.id = id;
        this.userListId = userListId;
        this.cardId = cardId;
        this.lang = lang;
	}
}
