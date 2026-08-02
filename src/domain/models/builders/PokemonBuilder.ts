import type { IAbility } from '../dto/Ability';
import type { IEvolutionNode } from '../dto/EvolutionNode';
import type { IPokemon } from '../dto/Pokemon';
import type { IPokemonCategory } from '../dto/PokemonCategory';
import type { IPokemonDescription } from '../dto/PokemonDescription';
import type { ISprites } from '../dto/Sprites';
import type { IStats } from '../dto/Stats';
import { PokemonEntity } from '../entities/PokemonEntity';
import type { PokemonType } from '../types/PokemonType';

export class PokemonBuilder {
  private pokemon: Partial<IPokemon> = {};

  withId(id: number): this {
    this.pokemon.id = id;
    return this;
  }
  withName(name: string): this {
    this.pokemon.name = name;
    return this;
  }
  withTypes(types: PokemonType[]): this {
    this.pokemon.types = types;
    return this;
  }
  withHeight(height: number): this {
    this.pokemon.height = height;
    return this;
  }
  withWeight(weight: number): this {
    this.pokemon.weight = weight;
    return this;
  }
  withDescriptions(descriptions: IPokemonDescription[]): this {
    this.pokemon.descriptions = descriptions;
    return this;
  }
  withStats(stats: IStats): this {
    this.pokemon.stats = stats;
    return this;
  }
  withAbilities(abilities: IAbility[]): this {
    this.pokemon.abilities = abilities;
    return this;
  }
  withCategories(categories: IPokemonCategory[]): this {
    this.pokemon.categories = categories;
    return this;
  }
  withSprites(sprites: ISprites): this {
    this.pokemon.sprites = sprites;
    return this;
  }
  withEvolutionChain(evolutionChain: IEvolutionNode[] | undefined): this {
    this.pokemon.evolutionChain = evolutionChain;
    return this;
  }
  build(): IPokemon {
    const required: (keyof IPokemon)[] = [
      'id',
      'name',
      'height',
      'weight',
      'descriptions',
      'sprites',
      'stats',
      'abilities',
      'types',
      'categories',
      'evolutionChain',
    ];

    const missing = required.filter(key => !(key in this.pokemon));
    if (missing.length > 0) {
      throw new Error(`PokemonBuilder.build() is missing required fields: ${missing.join(', ')}`);
    }

    return this.pokemon as IPokemon;
  }
  buildEntity(): PokemonEntity {
    return new PokemonEntity(this.build());
  }
}
