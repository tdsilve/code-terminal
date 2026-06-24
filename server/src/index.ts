import { Hono } from "hono"
import { logger } from "hono/logger"

const app = new Hono()

app.use(logger())

app.get("/", (c) => c.json({ message: "Hello from code-terminal server!" }))

app.get("/health", (c) => c.json({ status: "ok" }))

export default {
  port: 3000,
  fetch: app.fetch,
}
