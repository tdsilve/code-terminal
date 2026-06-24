import { createCliRenderer, Box, Text } from "@opentui/core"

const renderer = await createCliRenderer({ exitOnCtrlC: true })

renderer.root.add(
  Box(
    {
      borderStyle: "rounded",
      padding: 1,
      flexDirection: "column",
      gap: 1,
    },
    Text({ content: "code-terminal", fg: "#00FFFF", bold: true }),
    Text({ content: "Welcome! Press Ctrl+C to exit.", fg: "#AAAAAA" }),
  ),
)
