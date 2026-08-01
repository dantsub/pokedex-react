export interface IStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  specialAttack: number;
  specialDefense: number;
}

export const MAX_STAT_VALUE = 255;

export interface IStatInfo {
  key: keyof IStats;
  label: string;
  labelEs: string;
}

export const STAT_INFO_ORDER: readonly IStatInfo[] = [
  { key: 'hp', label: 'HP', labelEs: 'PS' },
  { key: 'attack', label: 'ATK', labelEs: 'ATQ' },
  { key: 'defense', label: 'DEF', labelEs: 'DEF' },
  { key: 'speed', label: 'SPE', labelEs: 'VEL' },
  { key: 'specialAttack', label: 'SP.A', labelEs: 'ES.A' },
  { key: 'specialDefense', label: 'SP.D', labelEs: 'ES.D' },
] as const;
