# code-terminal

A terminal-first AI coding assistant that helps you modify and manage codebases through natural language interactions.

## Stack

| Layer | Technology |
|---|---|
| Runtime & Package Manager | [Bun](https://bun.sh) |
| Language | TypeScript |
| HTTP Server | [Hono](https://hono.dev) |
| Terminal UI | [OpenTUI](https://opentui.com) |

> **Why Hono over `Bun.serve` directly?** Hono adds an ergonomic router and `hono/client` — export the app type and the RPC client automatically infers paths, methods, params, body, and response of each route. End-to-end type safety between server and client, no code generation required.

## Architecture

code-terminal is built on five core layers:

1. **Terminal UI** — Conversations, task visibility, execution logs, diffs, and interactive developer workflows (powered by OpenTUI).
2. **Agent Runtime** — Coordinates reasoning, planning, and task execution.
3. **Tool Execution Layer** — File operations, code search, Git workflows, and command execution.
4. **LLM Provider Layer** — Unified interface across multiple AI providers.
5. **File Operations** — Repository navigation, file access, modifications, and workspace interactions.

## Project Structure

```
code-terminal/
├── server/       # Hono HTTP server
└── cli/          # OpenTUI terminal interface
```

## Getting Started

Install dependencies from the repo root:

```sh
bun install
```

**Run the server:**

```sh
cd server && bun run dev
```

Starts on `http://localhost:3000`. Available routes: `GET /` and `GET /health`.

**Run the CLI:**

```sh
cd cli && bun run dev
```

Press `Ctrl+C` to exit the TUI.
