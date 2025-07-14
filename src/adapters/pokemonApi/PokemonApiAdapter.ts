import { Pokemon } from "../../models/Pokemon";

export class PokemonApiAdapter {
    
    async getPokemon(pokemonName: string): Promise<Pokemon | null> {

        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = await response.json();
            return new Pokemon(data.id, data.name);
        }catch(error){
            console.error(error);
            return null;
        }

    }

}