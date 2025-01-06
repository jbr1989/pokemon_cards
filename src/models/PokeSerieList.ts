import type { PokeSerie } from "./PokeSerie";

export class PokeSerieList {
    series: Array<PokeSerie>;

    constructor(series: Array<PokeSerie>) {
        this.series = series;
    }

}