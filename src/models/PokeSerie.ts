import type { PokeSet } from "./PokeSetMini";

export class PokeSerie {
    id: string;
    name: string;
    logo: string;
    sets: PokeSet[];

    constructor(id: string, name: string, logo: string | undefined, sets: PokeSet[] | null ) {
        this.id = id;
        this.name = name;
        this.logo = logo || '';
        this.sets = sets || [];
    }

    setSets(sets: PokeSet[]) {
        this.sets = sets;
    }
    
}