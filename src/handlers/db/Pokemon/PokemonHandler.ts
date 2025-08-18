import { TursoAdapter } from "../../../adapters/bbdd/TursoAdapter";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PokemonHandler {
	static db = new TursoAdapter();

    static async getAll(): Promise<{ pokemon: Pokemon[]; error: string | null }> {
        let pokemon: Pokemon[] = [];
        let error: string | null = null;

        try{
            // FIND LISTS in DB
            pokemon = await PokemonHandler.db.getAllPokemon();
            // console.log("LISTS", lists);
        }catch (e) {
            error = e.toString();
        }

        return { pokemon, error };
    }

}
