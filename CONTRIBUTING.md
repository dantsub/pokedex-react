# Contributing

Thanks for contributing to Pokédex React. Keep changes focused, tested, and consistent with the layer that owns the behavior.

## Development Setup

Requirements:

- Node.js LTS
- Bun

Install dependencies and start the development server:

```bash
bun install
bun run dev
```

## Before Opening a Pull Request

Run the project checks locally:

```bash
bun run typecheck
bun run lint
bun run test --run
bun run build
```

Use `bun run format` to format source files with Prettier.

## Code Organization

Follow the boundaries described in [`docs/architecture.md`](docs/architecture.md):

- Keep Pokémon rules and normalized contracts in `src/domain/`.
- Keep API access and response mapping in `src/data/`.
- Keep use-case coordination in `src/services/`.
- Keep React rendering and interaction in `src/ui/` and `src/app/`.
- Avoid putting domain rules directly in components.

## Tests

Use the existing test style and keep tests close to the code they cover. Domain tests should use `PokemonBuilder` rather than repeating large object literals. Reuse shared fixtures from `src/tests/fixtures/` — raw PokeAPI responses in `fixtures/pokeApi/`, builder-based domain data such as `buildPikachu` in the top-level fixtures — before writing a new one. Tests should be deterministic and should not require a live PokéAPI request.

When a change affects a public domain behavior, include tests for the normal case and relevant missing or unsupported data cases.

## Pull Requests

A pull request should include:

- A concise description of the behavior changed.
- Tests or a clear reason tests are not applicable.
- Documentation updates when a public contract, command, or architecture rule changes.
- Any known follow-up work or limitations.
