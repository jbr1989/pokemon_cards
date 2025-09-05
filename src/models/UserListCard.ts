export class UserListCard {
	id: number;
    cardId: string;
    lang: string;
	variant: string;
	listId: number;
	cardName: string;
	pokemonName: string;
	dexId: number;
	image: string | null;


	constructor(
		id: number,
		cardId: string,
        lang: string,
		variant: string,
		listId: number,
		cardName: string,
		pokemonName: string,
		dexId: number,
		image: string | null,
	) {
		this.id = id;
        this.cardId = cardId;
        this.lang = lang;
		this.variant = variant;
		this.listId = listId;
		this.cardName = cardName;
		this.pokemonName = pokemonName;
		this.dexId = dexId;
		this.image = null;

		if (this.cardId != "") {
			//console.log("LIST CARD", listCard);
			const cardIdParts = this.cardId.split("-");
			const setId = cardIdParts[0];
			const cardNum = cardIdParts[1];

			const indice = setId.search(/\d/); // Busca el primer número
			const serieId = indice !== -1 ? setId.slice(0, indice) : setId; // Obtiene el texto anterior al primer número

			// console.log(setId, cardNum, serieId);
			this.image = `https://assets.tcgdex.net/${this.lang}/${serieId}/${setId}/${cardNum}/low.webp`;
		}
	}
}
