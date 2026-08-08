import { PokemonBuilder, PokemonEntity } from '@/domain/models';
import type { IPokemon } from '@/domain/models';

const sprites = {
  frontDefault: null,
  backDefault: null,
  frontShiny: null,
  backShiny: null,
  frontFemale: null,
  backFemale: null,
  frontShinyFemale: null,
  backShinyFemale: null,
};

export function buildPikachu(): IPokemon {
  return new PokemonBuilder()
    .withId(25)
    .withName('pikachu')
    .withTypes(['electric'])
    .withHeight(4)
    .withWeight(60)
    .withDescriptions([])
    .withStats({ hp: 35, attack: 55, defense: 40, speed: 90, specialAttack: 50, specialDefense: 50 })
    .withAbilities([])
    .withCategories([])
    .withSprites(sprites)
    .withEvolutionChain(undefined)
    .build();
}

export function buildPikachuEntity(): PokemonEntity {
  return new PokemonEntity(buildPikachu());
}
