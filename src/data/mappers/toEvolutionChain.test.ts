import { describe, expect, it } from 'vitest';
import { toEvolutionChain } from './toEvolutionChain';
import { pikachuEvolutionChainApiResponse } from '@/tests/fixtures/pokeApi/pikachu.evolutionChain';
import type { RawEvolutionChain } from './types';

describe('toEvolutionChain', () => {
  it('parses the chain recursively and flattens it in order', () => {
    const result = toEvolutionChain(pikachuEvolutionChainApiResponse);

    expect(result.map(node => node.name)).toEqual(['pichu', 'pikachu', 'raichu']);
    expect(result[1].evolvesTo?.map(node => node.name)).toEqual(['raichu']);
  });

  it('extracts the id from the species URL to build the sprite URL', () => {
    const result = toEvolutionChain(pikachuEvolutionChainApiResponse);

    expect(result[0]).toMatchObject({
      id: 172,
      spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png',
    });
    expect(result[1].spriteUrl).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    );
    expect(result[2].spriteUrl).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png'
    );
  });

  it('maps evolution details on each node', () => {
    const result = toEvolutionChain(pikachuEvolutionChainApiResponse);

    expect(result[0]).toMatchObject({
      trigger: null,
      minLevel: null,
      item: null,
      minHappiness: null,
      timeOfDay: null,
    });
    expect(result[1]).toMatchObject({
      trigger: 'level-up',
      minLevel: 16,
      item: null,
    });
    expect(result[2]).toMatchObject({
      trigger: 'use-item',
      minLevel: null,
      item: 'thunder-stone',
    });
  });

  it('returns a single node for a chain without evolutions', () => {
    const chain = {
      id: 1,
      chain: {
        species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        evolution_details: [],
        evolves_to: [],
      },
    } as RawEvolutionChain;

    const result = toEvolutionChain(chain);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      name: 'bulbasaur',
      spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      evolvesTo: null,
    });
  });
});
