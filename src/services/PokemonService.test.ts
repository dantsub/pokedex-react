import { describe, expect, it, vi } from 'vitest';
import { PokemonService } from './PokemonService';
import type { IPokemonRepository } from '@/domain/contracts';
import { PokemonBuilder, PokemonEntity } from '@/domain/models';
import type { IPokemon, IPokemonListResponse } from '@/domain/models';

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

function buildPikachu(): IPokemon {
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

function buildListResponse(): IPokemonListResponse {
  return {
    items: [
      { id: 25, name: 'pikachu', spriteUrl: 'https://example.com/pikachu.png', types: ['electric'] },
    ],
    total: 1,
    offset: 0,
    limit: 20,
    hasNext: false,
    hasPrevious: false,
  };
}

function buildService(repository: Partial<IPokemonRepository> = {}) {
  const repo = {
    getPokemonById: vi.fn(),
    getPokemonByName: vi.fn(),
    getPokemonList: vi.fn(),
    ...repository,
  } as unknown as IPokemonRepository;

  return { service: new PokemonService(repo), repo };
}

describe('PokemonService', () => {
  it('getPokemonById delegates to the repository and wraps the result in a PokemonEntity', async () => {
    const { service, repo } = buildService({
      getPokemonById: vi.fn().mockResolvedValue(buildPikachu()),
    });

    const entity = await service.getPokemonById(25);

    expect(repo.getPokemonById).toHaveBeenCalledWith(25);
    expect(entity).toBeInstanceOf(PokemonEntity);
    expect(entity.getName()).toBe('Pikachu');
  });

  it('getPokemonByName delegates to the repository and wraps the result in a PokemonEntity', async () => {
    const { service, repo } = buildService({
      getPokemonByName: vi.fn().mockResolvedValue(buildPikachu()),
    });

    const entity = await service.getPokemonByName('pikachu');

    expect(repo.getPokemonByName).toHaveBeenCalledWith('pikachu');
    expect(entity.getName()).toBe('Pikachu');
  });

  it('getPokemonList delegates to the repository and returns the paginated response', async () => {
    const list = buildListResponse();
    const { service, repo } = buildService({
      getPokemonList: vi.fn().mockResolvedValue(list),
    });

    const result = await service.getPokemonList(0, 20);

    expect(repo.getPokemonList).toHaveBeenCalledWith(0, 20);
    expect(result).toEqual(list);
  });
});
