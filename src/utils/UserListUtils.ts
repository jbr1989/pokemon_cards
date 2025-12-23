import { PokemonHandler } from "../handlers/db/Pokemon/PokemonHandler";
import { UserListCard } from "../models/UserListCard";

export async function completeUserList(data: UserListCard, minId = 1, maxId = 1025) {

    // Obtener la lista de pokemon
    const { pokemon, error } = await PokemonHandler.getAll();
    const pokemonLookup = Object.fromEntries(pokemon.map(d => [d.id, d])); // { '1': Pokemon { id: 1, name: 'bulbasaur' }, ...}
    //console.log("POKEMON", pokemonLookup);

    // indexamos los que ya existen
    const lookup = Object.fromEntries(data.map(d => [d.dexId, d])); // { '1': UserListCard, ...}
    console.log("LOOKUP", lookup);

    // construimos la lista completa
    const completed = [];
    for (let dexId = minId; dexId <= maxId; dexId++) {
        if (lookup[dexId]) {
            completed.push(lookup[dexId]);
        } else {
            completed.push(new UserListCard(0, "", "", "", "", "", 0, "", pokemonLookup[dexId]?.name || "", dexId, null)); // objeto vacío
        }
    }

    // console.log("COMPLETED", completed);

    return completed;

}