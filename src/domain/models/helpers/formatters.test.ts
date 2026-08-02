import { describe, it, expect } from 'vitest';
import {
  decimetersToMeters,
  decimetersToFeet,
  hectogramsToKg,
  hectogramsToLb,
  capitalizeName,
  formatPokemonId,
} from '@/domain/models/helpers/formatters';

describe('formatters', () => {
  describe('decimetersToMeters', () => {
    it('converts decimeters to meters by dividing by 10', () => {
      expect(decimetersToMeters(70)).toBe(7);
      expect(decimetersToMeters(10)).toBe(1);
      expect(decimetersToMeters(0)).toBe(0);
    });

    it('supports fractional results', () => {
      expect(decimetersToMeters(15)).toBe(1.5);
      expect(decimetersToMeters(7)).toBeCloseTo(0.7, 10);
    });

    it('handles negative values', () => {
      expect(decimetersToMeters(-30)).toBe(-3);
    });
  });

  describe('decimetersToFeet', () => {
    it('converts decimeters to feet by multiplying by 3.281', () => {
      expect(decimetersToFeet(10)).toBeCloseTo(32.81, 3);
      expect(decimetersToFeet(0)).toBe(0);
    });

    it('handles fractional results', () => {
      expect(decimetersToFeet(7)).toBeCloseTo(22.967, 3);
    });

    it('handles negative values', () => {
      expect(decimetersToFeet(-10)).toBeCloseTo(-32.81, 3);
    });
  });

  describe('hectogramsToKg', () => {
    it('converts hectograms to kilograms by dividing by 10', () => {
      expect(hectogramsToKg(690)).toBe(69);
      expect(hectogramsToKg(10)).toBe(1);
      expect(hectogramsToKg(0)).toBe(0);
    });

    it('supports fractional results', () => {
      expect(hectogramsToKg(15)).toBe(1.5);
    });

    it('handles negative values', () => {
      expect(hectogramsToKg(-50)).toBe(-5);
    });
  });

  describe('hectogramsToLb', () => {
    it('converts hectograms to pounds by dividing by 4.536', () => {
      expect(hectogramsToLb(4536)).toBeCloseTo(1000, 3);
      expect(hectogramsToLb(0)).toBe(0);
    });

    it('handles fractional results', () => {
      expect(hectogramsToLb(690)).toBeCloseTo(152.116, 3);
    });

    it('handles negative values', () => {
      expect(hectogramsToLb(-4536)).toBeCloseTo(-1000, 3);
    });
  });

  describe('capitalizeName', () => {
    it('capitalizes the first letter of a lowercase string', () => {
      expect(capitalizeName('pikachu')).toBe('Pikachu');
      expect(capitalizeName('charizard')).toBe('Charizard');
    });

    it('leaves an already-capitalized string unchanged', () => {
      expect(capitalizeName('Bulbasaur')).toBe('Bulbasaur');
    });

    it('preserves the rest of the string as-is', () => {
      expect(capitalizeName('mrMime')).toBe('MrMime');
      expect(capitalizeName('ho-oh')).toBe('Ho-oh');
    });

    it('returns an empty string unchanged', () => {
      expect(capitalizeName('')).toBe('');
    });

    it('capitalizes a single character', () => {
      expect(capitalizeName('a')).toBe('A');
    });
  });

  describe('formatPokemonId', () => {
    it('pads the id to at least 3 digits with leading zeros', () => {
      expect(formatPokemonId(1)).toBe('#001');
      expect(formatPokemonId(25)).toBe('#025');
      expect(formatPokemonId(100)).toBe('#100');
    });

    it('does not truncate ids with more than 3 digits', () => {
      expect(formatPokemonId(1000)).toBe('#1000');
      expect(formatPokemonId(1010)).toBe('#1010');
    });

    it('prefixes the id with a hash symbol', () => {
      expect(formatPokemonId(0)).toBe('#000');
      expect(formatPokemonId(7)).toBe('#007');
    });
  });
});
