# Pokédex React

A Pokédex web application built with React, TypeScript, and Vite. It consumes the [PokéAPI](https://pokeapi.co/) to browse and look up information about Pokémon.

The project is organized around a small clean-architecture boundary: API response shapes stay in the data layer, domain models expose application behavior, and the UI consumes those models rather than raw API responses.

## Tech Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Vitest](https://vitest.dev/) — unit testing
- [Oxlint](https://oxc.rs/) — linting
- [Prettier](https://prettier.io/) — code formatting
- [Bun](https://bun.sh/) — package manager and script runner

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Bun](https://bun.sh/) (used to install dependencies and run the scripts below)

## Getting Started

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

Then open the local URL printed by Vite in the terminal.

## Available Scripts

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `bun run dev`           | Start the Vite dev server with hot module reload |
| `bun run build`         | Type-check and build the app for production      |
| `bun run preview`       | Preview the production build locally             |
| `bun run test`          | Run unit tests with Vitest                       |
| `bun run test:ui`       | Run tests with the Vitest UI                     |
| `bun run test:coverage` | Run tests and generate a coverage report         |
| `bun run lint`          | Lint the codebase with Oxlint                    |
| `bun run lint:fix`      | Lint and automatically fix issues with Oxlint    |
| `bun run format`        | Format `src/` files with Prettier                |
| `bun run typecheck`     | Run a TypeScript type check without emitting     |

## Project Structure

```
src/
├── app/          # Application-level hooks and configuration
├── assets/       # Static assets (images, fonts, etc.)
├── data/         # Data access layer
│   ├── mappers/   # Map raw API responses to domain models
│   └── repositories/ # API/data repositories
├── domain/       # Domain models and business types
│   └── models/
├── services/     # Application services
├── ui/           # UI components
└── utils/        # Shared utility functions
```

## API

This project uses the public [PokéAPI](https://pokeapi.co/). No API key is required.

API access may be unavailable occasionally, so network concerns should remain in the data layer. Domain tests use builders and fixtures instead of making network requests.

## Architecture

The main data flow is:

```text
PokéAPI -> data repositories/mappers -> domain models -> services -> app/UI
```

The domain layer is documented in [`src/domain/README.md`](src/domain/README.md). The broader architectural boundaries and dependency rules are documented in [`docs/architecture.md`](docs/architecture.md).

## Import Aliases

TypeScript aliases keep imports independent from deeply nested relative paths:

| Alias         | Directory        |
| ------------- | ---------------- |
| `@/*`         | `src/*`          |
| `@domain/*`   | `src/domain/*`   |
| `@data/*`     | `src/data/*`     |
| `@services/*` | `src/services/*` |
| `@app/*`      | `src/app/*`      |
| `@ui/*`       | `src/ui/*`       |
| `@utils/*`    | `src/utils/*`    |

## Supported Languages

The domain currently supports English (`en`) and Spanish (`es`). The list is defined in [`src/domain/models/types/Language.ts`](src/domain/models/types/Language.ts). Adding a language requires updating the supported language list and localized display behavior in the domain and data layers.

## Contributing

Before opening a pull request, run:

```bash
bun run typecheck
bun run lint
bun run test --run
bun run build
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the project conventions.

## License

This project is for educational purposes. Pokémon and related content are trademarks of Nintendo/Game Freak.
