import type { IPokemonRepository } from '@/domain/contracts';
import type { IPokemonListResponse } from '@/domain/models';
import { PokemonEntity } from '@/domain/models';

export class PokemonService {
  private readonly repository: IPokemonRepository;

  constructor(repository: IPokemonRepository) {
    this.repository = repository;
  }

  async getPokemonById(id: number): Promise<PokemonEntity> {
    return new PokemonEntity(await this.repository.getPokemonById(id));
  }

  async getPokemonByName(name: string): Promise<PokemonEntity> {
    return new PokemonEntity(await this.repository.getPokemonByName(name));
  }

  async getPokemonList(offset: number, limit: number): Promise<IPokemonListResponse> {
    return this.repository.getPokemonList(offset, limit);
  }
}
