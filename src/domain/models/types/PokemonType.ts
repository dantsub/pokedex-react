export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
  'stellar',
  'unknown',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

// Helper to iterate over the types array.
export function getAllPokemonTypes(): readonly string[] {
  return POKEMON_TYPES;
}

// Helper to validate if string is a valid pokemon type.
export function isValidPokemonType(value: string): value is PokemonType {
  return POKEMON_TYPES.includes(value as PokemonType);
}
