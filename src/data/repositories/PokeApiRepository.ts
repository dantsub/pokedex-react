import type { IPokemonRepository } from '@/domain/contracts';
import type { IPokemon, IPokemonListResponse } from '@/domain/models';
import { ApiServerError, NetworkError } from '@/data/errors';
import { PokemonNotFoundError } from '@/domain/errors';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_TIMEOUT = 10_000;
const MAX_RETRIES = 2;

export class PokeApiRepository implements IPokemonRepository {
  private readonly cache: Map<string, unknown>;
  private readonly timeout: number;

  constructor(timeout: number = DEFAULT_TIMEOUT) {
    this.cache = new Map();
    this.timeout = timeout;
  }

  async getPokemonById(id: number): Promise<IPokemon> {
    return this.fetchWithGuard<IPokemon>(`pokemon/${id}`, id);
  }

  async getPokemonByName(name: string): Promise<IPokemon> {
    return this.fetchWithGuard<IPokemon>(`pokemon/${name}`, name);
  }

  async getPokemonList(offset: number, limit: number): Promise<IPokemonListResponse> {
    return this.fetchWithCache<IPokemonListResponse>(`pokemon?offset=${offset}&limit=${limit}`);
  }

  async getEvolutionChain(pokeId: number): Promise<unknown> {
    return this.fetchWithCache(`evolution-chain/${pokeId}`);
  }

  clearCache(): void {
    this.cache.clear();
  }

  private async fetchWithGuard<T>(url: string, identifier: number | string): Promise<T> {
    try {
      return await this.fetchWithCache<T>(url);
    } catch (error) {
      if (error instanceof ApiServerError && error.statusCode === 404) {
        throw new PokemonNotFoundError(identifier);
      }
      throw error;
    }
  }

  private async fetchWithCache<T>(url: string): Promise<T> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as T;
    }

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= MAX_RETRIES; ++attempt) {
      try {
        const response = await this.fetchWithTimeout(`${POKEAPI_BASE_URL}/${url}`);
        if (!response.ok) {
          throw new ApiServerError(response.status);
        }
        const data = (await response.json()) as T;
        this.cache.set(url, data);
        return data;
      } catch (error) {
        if (error instanceof ApiServerError) {
          throw error;
        }
        lastError = error as Error;
      }
    }

    throw lastError ?? new NetworkError();
  }

  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      return await fetch(url, { signal: controller.signal });
    } catch (error) {
      throw new NetworkError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}