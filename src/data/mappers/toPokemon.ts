import type {
  IAbility,
  IEvolutionNode,
  IPokemon,
  IPokemonCategory,
  IPokemonDescription,
  ISprites,
  IStats,
} from '@/domain/models';
import { isSupportedLang } from '@/domain/models';
import { toPokemonTypes } from './utils';
import type { RawPokemon, RawSpecies } from './types';

function toSprites(sprites: RawPokemon['sprites']): ISprites {
  return {
    frontDefault: sprites.front_default,
    backDefault: sprites.back_default,
    frontShiny: sprites.front_shiny,
    backShiny: sprites.back_shiny,
    frontFemale: sprites.front_female,
    backFemale: sprites.back_female,
    frontShinyFemale: sprites.front_shiny_female,
    backShinyFemale: sprites.back_shiny_female,
  };
}

function toStats(stats: RawPokemon['stats']): IStats {
  const keyByStatName: Record<string, keyof IStats> = {
    hp: 'hp',
    attack: 'attack',
    defense: 'defense',
    'special-attack': 'specialAttack',
    'special-defense': 'specialDefense',
    speed: 'speed',
  };

  const result: IStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    specialAttack: 0,
    specialDefense: 0,
  };

  for (const stat of stats) {
    const key = keyByStatName[stat.stat.name];
    if (key) {
      result[key] = stat.base_stat;
    }
  }

  return result;
}

function toAbilities(abilities: RawPokemon['abilities']): IAbility[] {
  return abilities.map(ability => ({
    name: ability.ability.name,
    isHidden: ability.is_hidden,
  }));
}

function toDescriptions(species: RawSpecies): IPokemonDescription[] {
  const result: IPokemonDescription[] = [];
  for (const entry of species.flavor_text_entries) {
    if (!isSupportedLang(entry.language.name)) {
      continue;
    }
    if (result.some(description => description.lang === entry.language.name)) {
      continue;
    }
    result.push({
      flavorText: entry.flavor_text.replace(/[\n\f\r]+/g, ' '),
      lang: entry.language.name,
    });
  }
  return result;
}

function toCategories(species: RawSpecies): IPokemonCategory[] {
  const result: IPokemonCategory[] = [];
  for (const genus of species.genera) {
    if (isSupportedLang(genus.language.name)) {
      result.push({ genus: genus.genus, lang: genus.language.name });
    }
  }
  return result;
}

export function toPokemon(
  pokemon: RawPokemon,
  species: RawSpecies,
  evolutionChain?: IEvolutionNode[]
): IPokemon {
  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    descriptions: toDescriptions(species),
    sprites: toSprites(pokemon.sprites),
    stats: toStats(pokemon.stats),
    abilities: toAbilities(pokemon.abilities),
    types: toPokemonTypes(pokemon.types),
    categories: toCategories(species),
    evolutionChain,
  };
}
