import type { PokemonType } from '../types/PokemonType';
import type { IAbility } from './Ability';
import type { IEvolutionNode } from './EvolutionNode';
import type { IPokemonCategory } from './PokemonCategory';
import type { IPokemonDescription } from './PokemonDescription';
import type { ISprites } from './Sprites';
import type { IStats } from './Stats';

export interface IPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  descriptions: IPokemonDescription[];
  sprites: ISprites;
  stats: IStats;
  abilities: IAbility[];
  types: PokemonType[];
  categories: IPokemonCategory[];
  evolutionChain: IEvolutionNode[] | undefined;
}
