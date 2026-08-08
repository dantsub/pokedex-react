import { describe, expect, it, vi } from 'vitest';
import { PokemonService } from './PokemonService';
import type { IPokemonRepository } from '@/domain/contracts';
import { PokemonEntity } from '@/domain/models';
import type { IPokemonListResponse } from '@/domain/models';
import { buildPikachu } from '@/tests/fixtures/pikachu';

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

    expect(repo.getPokemonById).toHaveBeenCalledWith(25, undefined);
    expect(entity).toBeInstanceOf(PokemonEntity);
    expect(entity.getName()).toBe('Pikachu');
  });

  it('getPokemonByName delegates to the repository and wraps the result in a PokemonEntity', async () => {
    const { service, repo } = buildService({
      getPokemonByName: vi.fn().mockResolvedValue(buildPikachu()),
    });

    const entity = await service.getPokemonByName('pikachu');

    expect(repo.getPokemonByName).toHaveBeenCalledWith('pikachu', undefined);
    expect(entity.getName()).toBe('Pikachu');
  });

  it('getPokemonList delegates to the repository and returns the paginated response', async () => {
    const list = buildListResponse();
    const { service, repo } = buildService({
      getPokemonList: vi.fn().mockResolvedValue(list),
    });

    const result = await service.getPokemonList(0, 20);

    expect(repo.getPokemonList).toHaveBeenCalledWith(0, 20, undefined);
    expect(result).toEqual(list);
  });

  it('forwards the abort signal to the repository methods', async () => {
    const controller = new AbortController();
    const { service, repo } = buildService({
      getPokemonById: vi.fn().mockResolvedValue(buildPikachu()),
      getPokemonByName: vi.fn().mockResolvedValue(buildPikachu()),
      getPokemonList: vi.fn().mockResolvedValue(buildListResponse()),
    });

    await service.getPokemonById(25, controller.signal);
    await service.getPokemonByName('pikachu', controller.signal);
    await service.getPokemonList(0, 20, controller.signal);

    expect(repo.getPokemonById).toHaveBeenCalledWith(25, controller.signal);
    expect(repo.getPokemonByName).toHaveBeenCalledWith('pikachu', controller.signal);
    expect(repo.getPokemonList).toHaveBeenCalledWith(0, 20, controller.signal);
  });
});

