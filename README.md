Code Terminal

Stack

Bun
TypeScript
Hono


Note: Even though Bun ships with a built-in HTTP server (Bun.serve), this project uses Hono for an ergonomic router with type-safe RPC client inference — beyond the framework types, Hono provides hono/client: you export the app type and the client automatically infers paths, methods, params, body and response of each route, giving end-to-end typing between server and client with no code generation.

Code Terminal is a terminal-first AI coding assistant that helps, modify, and manage codebases through natural language interactions.

The platform is built on five core layers:





Terminal UI – Provides conversations, task visibility, execution logs, diffs, and interactive developer workflows.



Agent Runtime – Coordinates reasoning, planning, and task execution.



Tool Execution Layer – Enables access to file operations, code search, Git workflows, command execution, and other development tools.



LLM Provider Layer – Integrates with multiple AI providers through a unified interface.



File Operations – Manages repository navigation, file access, modifications, and workspace interactions.

