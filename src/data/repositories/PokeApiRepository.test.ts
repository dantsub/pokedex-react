import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiServerError, NetworkError } from '@/data/errors';
import { PokemonNotFoundError } from '@/domain/errors';
import {
  toEvolutionChain,
  toPokemon,
  toPokemonListItem,
  toPokemonListResponse,
} from '@/data/mappers';
import { PokeApiRepository } from './PokeApiRepository';
import { pikachuApiResponse } from '@/tests/fixtures/pokeApi/pikachu.pokemon';
import { pikachuSpeciesApiResponse } from '@/tests/fixtures/pokeApi/pikachu.species';
import { pikachuEvolutionChainApiResponse } from '@/tests/fixtures/pokeApi/pikachu.evolutionChain';
import { pokemonListApiResponse } from '@/tests/fixtures/pokeApi/pokemonList';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

const bulbasaurApiResponse = {
  id: 1,
  name: 'bulbasaur',
  types: [
    { slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } },
    { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } },
  ],
};

const ivysaurApiResponse = {
  id: 2,
  name: 'ivysaur',
  types: [
    { slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } },
    { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } },
  ],
};

function stubResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as unknown as Response;
}

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

  function mockPikachuGraph() {
    mockFetch([
      [/\/pokemon\/25$/, pikachuApiResponse],
      [/\/pokemon-species\/25$/, pikachuSpeciesApiResponse],
      [/\/evolution-chain\/10$/, pikachuEvolutionChainApiResponse],
    ]);
  }

  describe('getPokemonById', () => {
    it('fetches pokemon, species and evolution chain, and maps to IPokemon', async () => {
      mockPikachuGraph();

      const result = await repo.getPokemonById(25);

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(fetchMock).toHaveBeenCalledWith(`${POKEAPI_BASE_URL}/pokemon/25`, expect.anything());
      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/pokemon-species/25`,
        expect.anything()
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/evolution-chain/10`,
        expect.anything()
      );
      expect(result).toEqual(
        toPokemon(
          pikachuApiResponse,
          pikachuSpeciesApiResponse,
          toEvolutionChain(pikachuEvolutionChainApiResponse)
        )
      );
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
    it('resolves the pokemon by name and maps it', async () => {
      mockFetch([
        [/\/pokemon\/pikachu$/, pikachuApiResponse],
        [/\/pokemon-species\/25$/, pikachuSpeciesApiResponse],
        [/\/evolution-chain\/10$/, pikachuEvolutionChainApiResponse],
      ]);

      const result = await repo.getPokemonByName('pikachu');

      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/pokemon/pikachu`,
        expect.anything()
      );
      expect(result).toEqual(
        toPokemon(
          pikachuApiResponse,
          pikachuSpeciesApiResponse,
          toEvolutionChain(pikachuEvolutionChainApiResponse)
        )
      );
    });
  });

  describe('getPokemonList', () => {
    it('fetches the list and each item detail, then maps the response', async () => {
      mockFetch([
        [/offset=0&limit=20/, pokemonListApiResponse],
        [/\/pokemon\/1$/, bulbasaurApiResponse],
        [/\/pokemon\/2$/, ivysaurApiResponse],
      ]);

      const result = await repo.getPokemonList(0, 20);

      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/pokemon?offset=0&limit=20`,
        expect.anything()
      );
      const items = [
        toPokemonListItem(pokemonListApiResponse.results[0], bulbasaurApiResponse),
        toPokemonListItem(pokemonListApiResponse.results[1], ivysaurApiResponse),
      ];
      expect(result).toEqual(toPokemonListResponse(pokemonListApiResponse, 0, 20, items));
      expect(result.items[0].types).toEqual(['grass', 'poison']);
      expect(result.items[0].spriteUrl).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
      );
    });
  });

  describe('getEvolutionChain', () => {
    it('resolves the species to its evolution chain and maps it', async () => {
      mockFetch([
        [/\/pokemon-species\/25$/, pikachuSpeciesApiResponse],
        [/\/evolution-chain\/10$/, pikachuEvolutionChainApiResponse],
      ]);

      const result = await repo.getEvolutionChain(25);

      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/pokemon-species/25`,
        expect.anything()
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/evolution-chain/10`,
        expect.anything()
      );
      expect(result).toEqual(toEvolutionChain(pikachuEvolutionChainApiResponse));
    });
  });

  describe('cache', () => {
    it('reuses cached responses across the full request graph', async () => {
      mockPikachuGraph();

      await repo.getPokemonById(25);
      await repo.getPokemonById(25);

      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('re-fetches after clearCache', async () => {
      mockPikachuGraph();

      await repo.getPokemonById(25);
      repo.clearCache();
      await repo.getPokemonById(25);

      expect(fetchMock).toHaveBeenCalledTimes(6);
    });
  });
});