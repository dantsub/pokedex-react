import { describe, it, expect } from 'vitest';
import { PokemonBuilder } from '@/domain/models/builders/PokemonBuilder';
import type { IAbility } from '@/domain/models/dto/Ability';
import type { IEvolutionNode } from '@/domain/models/dto/EvolutionNode';
import type { IPokemonCategory } from '@/domain/models/dto/PokemonCategory';
import type { IPokemonDescription } from '@/domain/models/dto/PokemonDescription';
import type { ISprites } from '@/domain/models/dto/Sprites';
import type { IStats } from '@/domain/models/dto/Stats';

const sprites: ISprites = {
  frontDefault: 'https://example.com/front.png',
  backDefault: 'https://example.com/back.png',
  frontShiny: 'https://example.com/front-shiny.png',
  backShiny: 'https://example.com/back-shiny.png',
  frontFemale: null,
  backFemale: null,
  frontShinyFemale: null,
  backShinyFemale: null,
};

const stats: IStats = {
  hp: 35,
  attack: 55,
  defense: 40,
  speed: 90,
  specialAttack: 50,
  specialDefense: 50,
};

const abilities: IAbility[] = [
  { name: 'static', isHidden: false },
  { name: 'lightning-rod', isHidden: true },
];

const descriptions: IPokemonDescription[] = [
  {
    flavorText:
      'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
    lang: 'en',
  },
  {
    flavorText: 'Cuando varios de estos Pokémon se juntan, su electricidad puede causar tormentas.',
    lang: 'es',
  },
];

const categories: IPokemonCategory[] = [
  { genus: 'Mouse Pokémon', lang: 'en' },
  { genus: 'Pokémon Ratón', lang: 'es' },
];

const evolutionChain: IEvolutionNode[] = [
  {
    id: 25,
    name: 'pikachu',
    spriteUrl: 'https://example.com/pikachu.png',
    trigger: 'level-up',
    minLevel: 16,
    item: null,
    minHappiness: null,
    timeOfDay: null,
    knownMove: null,
    location: null,
    gender: null,
    heldItem: null,
    tradeSpecies: null,
    evolvesTo: null,
  },
];

function buildPikachu(includeSpanishMetadata = true) {
  return new PokemonBuilder()
    .withId(25)
    .withName('pikachu')
    .withTypes(['electric'])
    .withHeight(4)
    .withWeight(60)
    .withDescriptions(includeSpanishMetadata ? descriptions : [descriptions[0]])
    .withStats(stats)
    .withAbilities(abilities)
    .withCategories(includeSpanishMetadata ? categories : [categories[0]])
    .withSprites(sprites)
    .withEvolutionChain(evolutionChain)
    .buildEntity();
}

describe('PokemonEntity', () => {
  describe('getters', () => {
    it('exposes the sprites', () => {
      const entity = buildPikachu();
      expect(entity.sprites).toBe(sprites);
    });

    it('exposes the stats', () => {
      const entity = buildPikachu();
      expect(entity.stats).toBe(stats);
    });

    it('exposes the abilities', () => {
      const entity = buildPikachu();
      expect(entity.abilities).toBe(abilities);
    });

    it('exposes the types', () => {
      const entity = buildPikachu();
      expect(entity.types).toEqual(['electric']);
    });

    it('exposes the evolution chain', () => {
      const entity = buildPikachu();
      expect(entity.evolutionChain).toBe(evolutionChain);
    });

    it('returns an empty array when evolution chain is undefined', () => {
      const entity = new PokemonBuilder()
        .withId(25)
        .withName('pikachu')
        .withTypes(['electric'])
        .withHeight(4)
        .withWeight(60)
        .withDescriptions(descriptions)
        .withStats(stats)
        .withAbilities(abilities)
        .withCategories(categories)
        .withSprites(sprites)
        .withEvolutionChain(undefined)
        .buildEntity();

      expect(entity.evolutionChain).toEqual([]);
    });
  });

  describe('getCategory', () => {
    it('returns the category for the given language', () => {
      const entity = buildPikachu();
      expect(entity.getCategory('en')).toBe('Mouse Pokémon');
      expect(entity.getCategory('es')).toBe('Pokémon Ratón');
    });

    it('returns null when the language is not found', () => {
      const entity = buildPikachu(false);
      expect(entity.getCategory('es')).toBeNull();
    });
  });

  describe('getDescription', () => {
    it('returns the description for the given language', () => {
      const entity = buildPikachu();
      expect(entity.getDescription('en')).toBe(descriptions[0].flavorText);
      expect(entity.getDescription('es')).toBe(descriptions[1].flavorText);
    });

    it('returns null when the language is not found', () => {
      const entity = buildPikachu(false);
      expect(entity.getDescription('es')).toBeNull();
    });
  });

  describe('getDisplayHeight', () => {
    it('formats height in feet for english', () => {
      const entity = buildPikachu();
      // 4 dm * 3.281 = 13.124 ft
      expect(entity.getDisplayHeight('en')).toBe('13.124 ft');
    });

    it('formats height in meters for spanish', () => {
      const entity = buildPikachu();
      // 4 dm / 10 = 0.4 m
      expect(entity.getDisplayHeight('es')).toBe('0.4 m');
    });
  });

  describe('getDisplayWeight', () => {
    it('formats weight in pounds for english', () => {
      const entity = buildPikachu();
      // 60 hg / 4.536 = 13.227513... lb
      expect(entity.getDisplayWeight('en')).toBe(`${60 / 4.536} lb`);
    });

    it('formats weight in kilograms for spanish', () => {
      const entity = buildPikachu();
      // 60 hg / 10 = 6 kg
      expect(entity.getDisplayWeight('es')).toBe('6 kg');
    });
  });

  describe('getFormattedId', () => {
    it('pads the id with leading zeros and prefixes with #', () => {
      const entity = buildPikachu();
      expect(entity.getFormattedId()).toBe('#025');
    });

    it('does not pad ids with more than 3 digits', () => {
      const entity = new PokemonBuilder()
        .withId(1000)
        .withName('wailord')
        .withTypes(['water'])
        .withHeight(145)
        .withWeight(3980)
        .withDescriptions([])
        .withStats(stats)
        .withAbilities([])
        .withCategories([])
        .withSprites(sprites)
        .withEvolutionChain(undefined)
        .buildEntity();

      expect(entity.getFormattedId()).toBe('#1000');
    });
  });

  describe('getName', () => {
    it('capitalizes the pokemon name', () => {
      const entity = buildPikachu();
      expect(entity.getName()).toBe('Pikachu');
    });

    it('capitalizes a single-character name', () => {
      const entity = new PokemonBuilder()
        .withId(1)
        .withName('m')
        .withTypes(['normal'])
        .withHeight(1)
        .withWeight(1)
        .withDescriptions([])
        .withStats(stats)
        .withAbilities([])
        .withCategories([])
        .withSprites(sprites)
        .withEvolutionChain(undefined)
        .buildEntity();

      expect(entity.getName()).toBe('M');
    });
  });
});
