import { describe, it, expect } from 'vitest';
import {
  POKEMON_TYPES,
  getAllPokemonTypes,
  isValidPokemonType,
} from '@/domain/models/types/PokemonType';

describe('PokemonType', () => {
  describe('POKEMON_TYPES', () => {
    it('exposes a readonly tuple of pokemon type strings', () => {
      expect(Array.isArray(POKEMON_TYPES)).toBe(true);
      expect(POKEMON_TYPES.length).toBeGreaterThan(0);
      POKEMON_TYPES.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });

    it('contains the canonical pokemon types', () => {
      expect(POKEMON_TYPES).toContain('fire');
      expect(POKEMON_TYPES).toContain('water');
      expect(POKEMON_TYPES).toContain('grass');
      expect(POKEMON_TYPES).toContain('electric');
      expect(POKEMON_TYPES).toContain('normal');
    });

    it('contains the special types "stellar" and "unknown"', () => {
      expect(POKEMON_TYPES).toContain('stellar');
      expect(POKEMON_TYPES).toContain('unknown');
    });
  });

  describe('getAllPokemonTypes', () => {
    it('returns the same reference as POKEMON_TYPES', () => {
      expect(getAllPokemonTypes()).toBe(POKEMON_TYPES);
    });

    it('returns a readonly array of strings', () => {
      const result = getAllPokemonTypes();
      expect(result.length).toBe(POKEMON_TYPES.length);
      result.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });
  });

  describe('isValidPokemonType', () => {
    it('returns true for valid pokemon types', () => {
      expect(isValidPokemonType('fire')).toBe(true);
      expect(isValidPokemonType('water')).toBe(true);
      expect(isValidPokemonType('grass')).toBe(true);
      expect(isValidPokemonType('electric')).toBe(true);
      expect(isValidPokemonType('normal')).toBe(true);
      expect(isValidPokemonType('stellar')).toBe(true);
      expect(isValidPokemonType('unknown')).toBe(true);
    });

    it('returns false for invalid pokemon types', () => {
      expect(isValidPokemonType('shadow')).toBe(false);
      expect(isValidPokemonType('light')).toBe(false);
      expect(isValidPokemonType('')).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(isValidPokemonType('Fire')).toBe(false);
      expect(isValidPokemonType('FIRE')).toBe(false);
      expect(isValidPokemonType(' fire ')).toBe(false);
    });

    it('narrows the type when valid (type guard behavior)', () => {
      const value: string = 'fire';
      if (isValidPokemonType(value)) {
        // value is narrowed to PokemonType here
        const _assigned: string = value;
        expect(_assigned).toBe('fire');
      } else {
        expect.fail('expected value to be a valid pokemon type');
      }
    });
  });
});
