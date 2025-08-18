export class UserListCard {
	id: number;
    cardId: string;
    lang: string;
	listId: number;
	cardName: string;
	pokemonName: string;
	dexId: number


	constructor(
		id: number,
		cardId: string,
        lang: string,
		listId: number,
		cardName: string,
		pokemonName: string,
		dexId: number,
	) {
		this.id = id;
        this.cardId = cardId;
        this.lang = lang;
		this.listId = listId;
		this.cardName = cardName;
		this.pokemonName = pokemonName;
		this.dexId = dexId;
	}
}
