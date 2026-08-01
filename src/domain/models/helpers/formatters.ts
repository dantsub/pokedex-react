export function decimetersToMeters(dm: number): number {
  return dm / 10;
}

export function decimetersToFeet(dm: number): number {
  return dm * 3.281;
}

export function hectogramsToKg(hg: number): number {
  return hg / 10;
}

export function hectogramsToLb(hg: number): number {
  return hg / 4.536;
}

export function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}
