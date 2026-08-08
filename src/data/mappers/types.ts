export interface RawApiResource {
  name: string;
  url: string;
}

export interface RawPokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  front_female: string | null;
  back_female: string | null;
  front_shiny_female: string | null;
  back_shiny_female: string | null;
}

export interface RawPokemonStat {
  base_stat: number;
  effort: number;
  stat: RawApiResource;
}

export interface RawPokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: RawApiResource;
}

export interface RawPokemonType {
  slot: number;
  type: RawApiResource;
}

export interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: RawPokemonSprites;
  stats: RawPokemonStat[];
  abilities: RawPokemonAbility[];
  types: RawPokemonType[];
}

export interface RawSpeciesLocalized {
  language: RawApiResource;
}

export interface RawSpeciesName extends RawSpeciesLocalized {
  name: string;
}

export interface RawSpeciesGenus extends RawSpeciesLocalized {
  genus: string;
}

export interface RawSpeciesFlavorText extends RawSpeciesLocalized {
  flavor_text: string;
}

export interface RawSpecies {
  id: number;
  name: string;
  names: RawSpeciesName[];
  genera: RawSpeciesGenus[];
  flavor_text_entries: RawSpeciesFlavorText[];
  evolution_chain?: RawApiResource;
}

export interface RawEvolutionDetail {
  min_level: number | null;
  trigger: RawApiResource;
  item: RawApiResource | null;
  min_happiness: number | null;
  time_of_day: string | null;
  known_move: RawApiResource | null;
  location: RawApiResource | null;
  gender: RawApiResource | null;
  held_item: RawApiResource | null;
  trade_species: RawApiResource | null;
}

export interface RawEvolutionNode {
  species: RawApiResource;
  evolution_details: RawEvolutionDetail[];
  evolves_to: RawEvolutionNode[];
}

export interface RawEvolutionChain {
  id: number;
  chain: RawEvolutionNode;
}

export interface RawPokemonListResult {
  name: string;
  url: string;
}

export interface RawPokemonList {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawPokemonListResult[];
}
