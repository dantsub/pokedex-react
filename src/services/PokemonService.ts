import type { IPokemonRepository } from '@/domain/contracts';
import type { IPokemonListResponse } from '@/domain/models';
import { PokemonEntity } from '@/domain/models';

export class PokemonService {
  private readonly repository: IPokemonRepository;

  constructor(repository: IPokemonRepository) {
    this.repository = repository;
  }

  async getPokemonById(id: number, signal?: AbortSignal): Promise<PokemonEntity> {
    return new PokemonEntity(await this.repository.getPokemonById(id, signal));
  }

  async getPokemonByName(name: string, signal?: AbortSignal): Promise<PokemonEntity> {
    return new PokemonEntity(await this.repository.getPokemonByName(name, signal));
  }

  async getPokemonList(
    offset: number,
    limit: number,
    signal?: AbortSignal
  ): Promise<IPokemonListResponse> {
    return this.repository.getPokemonList(offset, limit, signal);
  }
}
