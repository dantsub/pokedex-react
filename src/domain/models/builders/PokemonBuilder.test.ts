import { describe, expect, it } from 'vitest';
import { PokemonBuilder } from './PokemonBuilder';
import type { ISprites } from '../dto/Sprites';
import type { IStats } from '../dto/Stats';

const sprites: ISprites = {
  frontDefault: null,
  backDefault: null,
  frontShiny: null,
  backShiny: null,
  frontFemale: null,
  backFemale: null,
  frontShinyFemale: null,
  backShinyFemale: null,
};

const stats: IStats = {
  hp: 45,
  attack: 49,
  defense: 49,
  speed: 45,
  specialAttack: 65,
  specialDefense: 65,
};

function completeBuilder(): PokemonBuilder {
  return new PokemonBuilder()
    .withId(1)
    .withName('bulbasaur')
    .withTypes(['grass', 'poison'])
    .withHeight(7)
    .withWeight(69)
    .withDescriptions([])
    .withStats(stats)
    .withAbilities([])
    .withCategories([])
    .withSprites(sprites)
    .withEvolutionChain(undefined);
}

describe('PokemonBuilder', () => {
  it('builds a complete Pokemon DTO', () => {
    const pokemon = completeBuilder().build();

    expect(pokemon).toEqual({
      id: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      height: 7,
      weight: 69,
      descriptions: [],
      stats,
      abilities: [],
      categories: [],
      sprites,
      evolutionChain: undefined,
    });
  });

  it('builds a PokemonEntity', () => {
    const entity = completeBuilder().buildEntity();

    expect(entity.getFormattedId()).toBe('#001');
    expect(entity.getName()).toBe('Bulbasaur');
  });

  it('throws when required fields are missing', () => {
    expect(() => new PokemonBuilder().withId(1).build()).toThrow(
      'PokemonBuilder.build() is missing required fields'
    );
  });

  it('allows evolutionChain to be explicitly undefined', () => {
    expect(() => completeBuilder().withEvolutionChain(undefined).build()).not.toThrow();
  });
});
