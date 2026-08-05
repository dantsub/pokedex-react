import type { PokemonType } from '@/domain/models';
import { isValidPokemonType } from '@/domain/models';
import type { RawPokemonType } from './types';

export const POKEMON_SPRITE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function extractIdFromResourceUrl(url: string): number {
  const segments = url.split('/').filter(Boolean);
  return Number(segments[segments.length - 1]);
}

export function buildSpriteUrl(id: number): string {
  return `${POKEMON_SPRITE_BASE_URL}/${id}.png`;
}

export function toPokemonTypes(types: RawPokemonType[]): PokemonType[] {
  const result: PokemonType[] = [];
  for (const type of types) {
    if (isValidPokemonType(type.type.name)) {
      result.push(type.type.name);
    }
  }
  return result;
}
