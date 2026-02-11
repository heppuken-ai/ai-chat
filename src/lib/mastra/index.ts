import { Agent } from "@mastra/core/agent";

export function createCharacterAgent(systemPrompt: string) {
  return new Agent({
    id: "character-agent",
    name: "Character Agent",
    instructions: systemPrompt,
    model: "anthropic/claude-sonnet-4-20250514",
  });
}
