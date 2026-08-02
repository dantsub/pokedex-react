import type { IPokemonListItem } from './PokemonListItem';

export interface IPokemonListResponse {
  items: IPokemonListItem[];
  total: number;
  offset: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
