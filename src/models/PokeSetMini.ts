export class PokeSetMini {
    id: string;
    name: string;
    logo: string;
    symbol: string;
    cardCount: { official: number, total: number };

    constructor(id: string, name: string, logo: string | undefined, symbol: string | undefined, cardCount: { official: number, total: number }) {
        this.id = id;
        this.name = name;
        this.logo = logo || '';
        this.symbol = symbol || '';
        this.cardCount = cardCount;
    }
    
}