# Domain Models

The domain layer contains the application's Pokémon concepts and rules. It should remain independent from React, browser APIs, and network clients.

## Responsibilities

- Define domain data contracts in `models/dto/`.
- Wrap raw Pokémon data in `PokemonEntity` and expose behavior used by the application.
- Keep reusable, deterministic conversions in `models/helpers/`.
- Keep shared closed sets such as languages and Pokémon types in `models/types/`.
- Provide `PokemonBuilder` for readable test data.

## Data Model Flow

```text
Raw API response -> mapper -> IPokemon -> PokemonEntity -> UI/service
```

DTO interfaces describe the normalized data shape. `PokemonEntity` is the behavior boundary: callers use methods such as `getName()`, `getCategory()`, and `getDisplayHeight()` instead of duplicating formatting rules in components.

## Language Support

`SupportedLang` is derived from `SUPPORTED_LANGS` in `models/types/Language.ts`. The current supported values are `en` and `es`.

To add a language:

1. Add the language code to `SUPPORTED_LANGS`.
2. Add localized API mapping where the data layer builds descriptions and categories.
3. Add display units and conversion behavior to `PokemonEntity`.
4. Add tests for localized text and measurements.

Keep the union and runtime list together so compile-time validation and runtime validation cannot drift apart.

## PokemonEntity

`PokemonEntity` accepts a complete `IPokemon` value and exposes read-only access to the normalized data plus display behavior. It returns an empty array when `evolutionChain` is undefined, and returns `null` when a requested localized category or description is not available.

Measurements use PokéAPI's units internally:

- Height is stored in decimeters.
- Weight is stored in hectograms.
- English display values use feet and pounds.
- Spanish display values use meters and kilograms.

## PokemonBuilder

`PokemonBuilder` is a test-data builder, not a production data-construction API. Call the `with...` methods needed for a scenario, then call `build()` or `buildEntity()`.

`build()` validates every required property and throws an error naming missing fields. `evolutionChain` must be explicitly configured, including with `undefined`, because that value is part of the DTO contract.

## Testing Guidance

Prefer domain tests that:

- Use `PokemonBuilder` to describe only the data relevant to the scenario.
- Test behavior through `PokemonEntity` public methods.
- Test formatter functions as pure functions.
- Avoid network requests and React rendering in this layer.

When changing a domain contract, update the related DTO, mapper, entity behavior, and focused tests together.
