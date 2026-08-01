import type { PokemonType } from '../types/PokemonType';

export interface IPokemonListItem {
  id: number;
  name: string;
  spriteUrl: string;
  types: PokemonType[];
}
