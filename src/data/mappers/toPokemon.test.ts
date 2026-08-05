import { describe, expect, it } from 'vitest';
import { toPokemon } from './toPokemon';
import { pikachuApiResponse } from '@/tests/fixtures/pokeApi/pikachu.pokemon';
import { pikachuSpeciesApiResponse } from '@/tests/fixtures/pokeApi/pikachu.species';
import type { RawSpecies } from './types';

describe('toPokemon', () => {
  it('maps basic data, sprites, stats, abilities and types', () => {
    const result = toPokemon(pikachuApiResponse, pikachuSpeciesApiResponse);

    expect(result.id).toBe(25);
    expect(result.name).toBe('pikachu');
    expect(result.height).toBe(4);
    expect(result.weight).toBe(60);
    expect(result.sprites).toEqual({
      frontDefault:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      backDefault:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
      frontShiny:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png',
      backShiny: null,
      frontFemale: null,
      backFemale: null,
      frontShinyFemale: null,
      backShinyFemale: null,
    });
    expect(result.stats).toEqual({
      hp: 35,
      attack: 55,
      defense: 40,
      speed: 90,
      specialAttack: 50,
      specialDefense: 50,
    });
    expect(result.abilities).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: true },
    ]);
    expect(result.types).toEqual(['electric']);
  });

  it('filters descriptions and categories by supported languages', () => {
    const result = toPokemon(pikachuApiResponse, pikachuSpeciesApiResponse);

    expect(result.descriptions).toEqual([
      {
        flavorText:
          'When several of these POKéMON gather, their electricity could build and cause lightning storms.',
        lang: 'en',
      },
      {
        flavorText: 'Varios de estos POKéMON se pueden juntar y generar tormentas eléctricas.',
        lang: 'es',
      },
    ]);
    expect(result.categories).toEqual([
      { genus: 'Mouse Pokémon', lang: 'en' },
      { genus: 'Pokémon Ratón', lang: 'es' },
    ]);
  });

  it('cleans line breaks from flavor text', () => {
    const species = {
      ...pikachuSpeciesApiResponse,
      flavor_text_entries: [
        {
          flavor_text: 'Two\r\nlines.\fWith feed.',
          language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' },
        },
      ],
    } as RawSpecies;

    const result = toPokemon(pikachuApiResponse, species);

    expect(result.descriptions).toEqual([{ flavorText: 'Two lines. With feed.', lang: 'en' }]);
  });

  it('preserves the provided evolution chain', () => {
    const evolutionChain = [{ id: 172, name: 'pichu', spriteUrl: 'http://x/172.png', trigger: null, minLevel: null, item: null, minHappiness: null, timeOfDay: null, knownMove: null, location: null, gender: null, heldItem: null, tradeSpecies: null, evolvesTo: null }];

    const result = toPokemon(pikachuApiResponse, pikachuSpeciesApiResponse, evolutionChain);

    expect(result.evolutionChain).toBe(evolutionChain);
  });

  it('leaves evolutionChain undefined when omitted', () => {
    const result = toPokemon(pikachuApiResponse, pikachuSpeciesApiResponse);

    expect(result.evolutionChain).toBeUndefined();
  });
});
