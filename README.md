# Pokédex React

A Pokédex web application built with React, TypeScript, and Vite. It consumes the [PokéAPI](https://pokeapi.co/) to browse and look up information about Pokémon.

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
- [Bun](https://bun.sh/) (used to run the dev server scripts)

## Getting Started

Install dependencies:

```bash
bun install
```

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

## License

This project is for educational purposes. Pokémon and related content are trademarks of Nintendo/Game Freak.
