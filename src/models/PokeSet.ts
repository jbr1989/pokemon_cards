import type { StringValidation } from "zod";
import type { PokeCard } from "./PokeCard";
import { PokeSetMini } from "./PokeSetMini";

export class PokeSet extends PokeSetMini {
	cards: Array<PokeCard>;
	legal: { expanded: boolean; standard: boolean };
	releaseDate: Date;
	serieId: string;

	constructor(
		id: string,
		name: string,
		logo: string | undefined,
		symbol: string | undefined,
		cardCount: { official: number; total: number },
		cards: Array<PokeCard>,
		legal: {
			expanded: boolean;
			standard: boolean;
		},
		releaseDate: Date,
		serieId: string,
	) {
		super(id, name, logo, symbol, cardCount);

		this.cards = cards;
		this.legal = legal;
		this.releaseDate = releaseDate;
		this.serieId = serieId;
	}
}
