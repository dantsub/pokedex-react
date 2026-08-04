import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiServerError, NetworkError } from '@/data/errors';
import { PokemonNotFoundError } from '@/domain/errors';
import { PokeApiRepository } from './PokeApiRepository';
import { pikachuApiResponse } from '@/tests/fixtures/pokeApi/pikachu.pokemon';
import { pikachuEvolutionChainApiResponse } from '@/tests/fixtures/pokeApi/pikachu.evolutionChain';
import { pokemonListApiResponse } from '@/tests/fixtures/pokeApi/pokemonList';

function stubResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as unknown as Response;
}

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

describe('PokeApiRepository', () => {
  const fetchMock = vi.fn();
  let repo: PokeApiRepository;

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    repo = new PokeApiRepository();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  function mockFetch(
    matchers: Array<[RegExp | string, unknown, number?]>,
    fallbackStatus = 404
  ) {
    fetchMock.mockImplementation((input: RequestInfo | URL): Promise<Response> => {
      const url = String(input);
      const match = matchers.find(([pattern]) =>
        pattern instanceof RegExp ? pattern.test(url) : url.includes(pattern)
      );
      if (!match) {
        return Promise.resolve(stubResponse({}, fallbackStatus));
      }
      const [, data, status] = match;
      return Promise.resolve(stubResponse(data, status ?? 200));
    });
  }

  describe('getPokemonById', () => {
    it('fetches the pokemon/{id} endpoint', async () => {
      mockFetch([[/\/pokemon\/25$/, pikachuApiResponse]]);
      const result = await repo.getPokemonById(25);

      expect(fetchMock).toHaveBeenCalledWith(`${POKEAPI_BASE_URL}/pokemon/25`, expect.anything());
      expect(result).toEqual(pikachuApiResponse);
    });

    it('throws PokemonNotFoundError on a 404', async () => {
      mockFetch([[/\/pokemon\/9999/, {}, 404]]);

      const promise = repo.getPokemonById(9999);
      await expect(promise).rejects.toBeInstanceOf(PokemonNotFoundError);
      await expect(promise).rejects.toMatchObject({ identifier: 9999 });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('throws ApiServerError on a 500', async () => {
      mockFetch([[/\/pokemon\/25/, {}, 500]]);

      const promise = repo.getPokemonById(25);
      await expect(promise).rejects.toBeInstanceOf(ApiServerError);
      await expect(promise).rejects.toMatchObject({ statusCode: 500 });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('throws NetworkError when fetch rejects', async () => {
      fetchMock.mockRejectedValue(new TypeError('fetch failed'));

      await expect(repo.getPokemonById(25)).rejects.toBeInstanceOf(NetworkError);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('throws NetworkError on timeout', async () => {
      vi.useFakeTimers();
      fetchMock.mockImplementation(
        (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              const error = new Error('The operation was aborted');
              error.name = 'AbortError';
              reject(error);
            });
          })
      );

      const timeoutRepo = new PokeApiRepository(100);
      const promise = timeoutRepo.getPokemonById(25);
      const assertion = expect(promise).rejects.toBeInstanceOf(NetworkError);
      await vi.advanceTimersByTimeAsync(1_000);
      await assertion;
    });
  });

  describe('getPokemonByName', () => {
    it('fetches the pokemon/{name} endpoint', async () => {
      mockFetch([[/\/pokemon\/pikachu$/, pikachuApiResponse]]);

      await repo.getPokemonByName('pikachu');

      expect(fetchMock).toHaveBeenCalledWith(`${POKEAPI_BASE_URL}/pokemon/pikachu`, expect.anything());
    });
  });

  describe('getPokemonList', () => {
    it('fetches the list with offset and limit query params', async () => {
      mockFetch([[/offset=0&limit=20/, pokemonListApiResponse]]);

      const result = await repo.getPokemonList(0, 20);

      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/pokemon?offset=0&limit=20`,
        expect.anything()
      );
      expect(result).toEqual(pokemonListApiResponse);
    });
  });

  describe('getEvolutionChain', () => {
    it('fetches the evolution-chain/{id} endpoint', async () => {
      mockFetch([[/\/evolution-chain\/10/, pikachuEvolutionChainApiResponse]]);

      const result = await repo.getEvolutionChain(10);

      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/evolution-chain/10`,
        expect.anything()
      );
      expect(result).toEqual(pikachuEvolutionChainApiResponse);
    });
  });

  describe('cache', () => {
    it('returns the cached response for the same URL', async () => {
      mockFetch([[/\/pokemon\/25/, pikachuApiResponse]]);

      await repo.getPokemonById(25);
      await repo.getPokemonById(25);

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('re-fetches after clearCache', async () => {
      mockFetch([[/\/pokemon\/25/, pikachuApiResponse]]);

      await repo.getPokemonById(25);
      repo.clearCache();
      await repo.getPokemonById(25);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});