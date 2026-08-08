import type { IPokemonRepository } from '@/domain/contracts';
import type { IEvolutionNode, IPokemon, IPokemonListResponse } from '@/domain/models';
import { ApiServerError, NetworkError } from '@/data/errors';
import { PokemonNotFoundError } from '@/domain/errors';
import {
  extractIdFromResourceUrl,
  toEvolutionChain,
  toPokemon,
  toPokemonListItem,
  toPokemonListResponse,
} from '@/data/mappers';
import type { RawEvolutionChain, RawPokemon, RawPokemonList, RawSpecies } from '@/data/mappers';

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

  async getPokemonById(id: number, signal?: AbortSignal): Promise<IPokemon> {
    return this.fetchPokemon(id, signal);
  }

  async getPokemonByName(name: string, signal?: AbortSignal): Promise<IPokemon> {
    return this.fetchPokemon(name, signal);
  }

  async getPokemonList(
    offset: number,
    limit: number,
    signal?: AbortSignal
  ): Promise<IPokemonListResponse> {
    const list = await this.fetchWithCache<RawPokemonList>(
      `pokemon?offset=${offset}&limit=${limit}`,
      signal
    );

    const items = await Promise.all(
      list.results.map(async result => {
        const pokemon = await this.fetchWithCache<RawPokemon>(
          `pokemon/${extractIdFromResourceUrl(result.url)}`,
          signal
        );
        return toPokemonListItem(result, pokemon);
      })
    );

    return toPokemonListResponse(list, offset, limit, items);
  }

  clearCache(): void {
    this.cache.clear();
  }

  private async fetchPokemon(identity: number | string, signal?: AbortSignal): Promise<IPokemon> {
    const pokemon = await this.fetchWithGuard<RawPokemon>(`pokemon/${identity}`, identity, signal);
    const species = await this.fetchWithGuard<RawSpecies>(
      `pokemon-species/${pokemon.id}`,
      identity,
      signal
    );
    const evolutionChain = await this.resolveEvolutionChain(species, signal);

    return toPokemon(pokemon, species, evolutionChain);
  }

  private async resolveEvolutionChain(
    species: RawSpecies,
    signal?: AbortSignal
  ): Promise<IEvolutionNode[] | undefined> {
    if (!species.evolution_chain?.url) {
      return undefined;
    }

    const chainId = extractIdFromResourceUrl(species.evolution_chain.url);
    const chain = await this.fetchWithCache<RawEvolutionChain>(
      `evolution-chain/${chainId}`,
      signal
    );

    return toEvolutionChain(chain);
  }

  private async fetchWithGuard<T>(
    url: string,
    identifier: number | string,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      return await this.fetchWithCache<T>(url, signal);
    } catch (error) {
      if (error instanceof ApiServerError && error.statusCode === 404) {
        throw new PokemonNotFoundError(identifier);
      }
      throw error;
    }
  }

  private async fetchWithCache<T>(url: string, signal?: AbortSignal): Promise<T> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as T;
    }

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= MAX_RETRIES; ++attempt) {
      try {
        const response = await this.fetchWithTimeout(`${POKEAPI_BASE_URL}/${url}`, signal);
        if (!response.ok) {
          throw new ApiServerError(response.status);
        }
        const data = (await response.json()) as T;
        this.cache.set(url, data);
        return data;
      } catch (error) {
        if (signal?.aborted) {
          throw error;
        }
        if (error instanceof ApiServerError) {
          throw error;
        }
        lastError = error as Error;
      }
    }

    throw lastError ?? new NetworkError();
  }

  private async fetchWithTimeout(url: string, signal?: AbortSignal): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const onExternalAbort = () => controller.abort();
    signal?.addEventListener('abort', onExternalAbort, { once: true });

    try {
      return await fetch(url, { signal: controller.signal });
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
      throw new NetworkError(error);
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener('abort', onExternalAbort);
    }
  }
}