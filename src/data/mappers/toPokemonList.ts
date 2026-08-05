import type { IPokemonListItem, IPokemonListResponse } from '@/domain/models';
import { buildSpriteUrl, extractIdFromResourceUrl, toPokemonTypes } from './utils';
import type { RawPokemon, RawPokemonList } from './types';

export function toPokemonListItem(
  result: RawPokemonList['results'][number],
  pokemon: RawPokemon
): IPokemonListItem {
  const id = extractIdFromResourceUrl(result.url);

  return {
    id,
    name: result.name,
    spriteUrl: buildSpriteUrl(id),
    types: toPokemonTypes(pokemon.types),
  };
}

export function toPokemonListResponse(
  list: RawPokemonList,
  offset: number,
  limit: number,
  items: IPokemonListItem[]
): IPokemonListResponse {
  return {
    items,
    total: list.count,
    offset,
    limit,
    hasNext: offset + limit < list.count,
    hasPrevious: offset > 0,
  };
}
