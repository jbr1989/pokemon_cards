export class PokeCard {
    id: string;
    localId: string;
    name: string;
    image: string | null;
    category: string | null;
    illustrator: string | null;
    rarity: string | null;
    variants: {
        normal: boolean | null;
        reverse: boolean | null;
        holo: boolean | null;
        firstEdition: boolean | null;
        wPromo: boolean | null;
    };

    constructor(id: string, localId: string, name: string, image: string | undefined, category: string | undefined, illustrator: string | undefined, rarity: string | undefined, variants: { normal: boolean | undefined; reverse: boolean | undefined; holo: boolean | undefined; firstEdition: boolean | undefined; wPromo: boolean | undefined }) {
        this.id = id;
        this.localId = localId;
        this.name = name;
        this.image = (image || null);
        this.category = (category || null);
        this.illustrator = (illustrator || null);
        this.rarity = (rarity || null);
        this.variants = {
            normal: (variants.normal || null),
            reverse: (variants.reverse || null),
            holo: (variants.holo || null),
            firstEdition: (variants.firstEdition || null),
            wPromo: (variants.wPromo || null),
        }
    }
    
}