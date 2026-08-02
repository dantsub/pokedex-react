import type { IAbility } from '../dto/Ability';
import type { IEvolutionNode } from '../dto/EvolutionNode';
import type { IPokemon } from '../dto/Pokemon';
import type { ISprites } from '../dto/Sprites';
import type { IStats } from '../dto/Stats';
import {
  capitalizeName,
  decimetersToFeet,
  decimetersToMeters,
  formatPokemonId,
  hectogramsToKg,
  hectogramsToLb,
} from '../helpers/formatters';
import type { PokemonType } from '../types/PokemonType';
import type { SupportedLang } from '../types/Language';

export class PokemonEntity {
  private readonly data: IPokemon;

  constructor(data: IPokemon) {
    this.data = data;
  }

  get sprites(): ISprites {
    return this.data.sprites;
  }

  get stats(): IStats {
    return this.data.stats;
  }

  get abilities(): IAbility[] {
    return this.data.abilities;
  }

  get types(): PokemonType[] {
    return this.data.types;
  }

  get evolutionChain(): IEvolutionNode[] {
    return this.data.evolutionChain ?? [];
  }

  getCategory(lang: SupportedLang): string | null {
    const category = this.data.categories.find(category => category.lang === lang);
    return category?.genus ?? null;
  }

  getDescription(lang: SupportedLang): string | null {
    const description = this.data.descriptions.find(description => description.lang === lang);
    return description?.flavorText ?? null;
  }

  getDisplayHeight(lang: SupportedLang): string {
    const format: Record<SupportedLang, { fn: (dm: number) => number; ext: string }> = {
      en: { fn: decimetersToFeet, ext: 'ft' },
      es: { fn: decimetersToMeters, ext: 'm' },
    };

    return `${format[lang].fn(this.data.height)} ${format[lang].ext}`;
  }

  getDisplayWeight(lang: SupportedLang): string {
    const format: Record<SupportedLang, { fn: (hg: number) => number; ext: string }> = {
      en: { fn: hectogramsToLb, ext: 'lb' },
      es: { fn: hectogramsToKg, ext: 'kg' },
    };

    return `${format[lang].fn(this.data.weight)} ${format[lang].ext}`;
  }

  getFormattedId(): string {
    return formatPokemonId(this.data.id);
  }

  getName(): string {
    return capitalizeName(this.data.name);
  }
}
