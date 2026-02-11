import "@/lib/env";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { streamSSE } from "hono/streaming";
import { prisma } from "@/lib/prisma/client";
import { createCharacterAgent } from "@/lib/mastra";

const app = new Hono().basePath("/api");

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── Characters ───

app.get("/characters", async (c) => {
  const characters = await prisma.character.findMany({
    orderBy: { createdAt: "desc" },
  });
  return c.json(characters);
});

app.post("/characters", async (c) => {
  const body = await c.req.json<{
    name: string;
    description: string;
    systemPrompt: string;
    avatarUrl?: string;
  }>();

  // Validation
  if (!body.name || body.name.length < 1 || body.name.length > 50) {
    return c.json({ error: "名前は1〜50文字で入力してください" }, 400);
  }
  if (!body.description || body.description.length < 1 || body.description.length > 200) {
    return c.json({ error: "説明は1〜200文字で入力してください" }, 400);
  }
  if (!body.systemPrompt || body.systemPrompt.length < 1 || body.systemPrompt.length > 5000) {
    return c.json({ error: "システムプロンプトは1〜5000文字で入力してください" }, 400);
  }

  const character = await prisma.character.create({
    data: {
      name: body.name,
      description: body.description,
      systemPrompt: body.systemPrompt,
      avatarUrl: body.avatarUrl ?? null,
      isPreset: false,
    },
  });
  return c.json(character, 201);
});

app.put("/characters/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    name?: string;
    description?: string;
    systemPrompt?: string;
    avatarUrl?: string;
  }>();

  // Validation
  if (body.name !== undefined && (body.name.length < 1 || body.name.length > 50)) {
    return c.json({ error: "名前は1〜50文字で入力してください" }, 400);
  }
  if (body.description !== undefined && (body.description.length < 1 || body.description.length > 200)) {
    return c.json({ error: "説明は1〜200文字で入力してください" }, 400);
  }
  if (body.systemPrompt !== undefined && (body.systemPrompt.length < 1 || body.systemPrompt.length > 5000)) {
    return c.json({ error: "システムプロンプトは1〜5000文字で入力してください" }, 400);
  }

  const character = await prisma.character.update({
    where: { id },
    data: body,
  });
  return c.json(character);
});

app.delete("/characters/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.character.delete({ where: { id } });
  return c.json({ success: true });
});

// ─── Conversations ───

app.post("/conversations", async (c) => {
  const body = await c.req.json<{
    characterId: string;
    title?: string;
  }>();
  const character = await prisma.character.findUniqueOrThrow({
    where: { id: body.characterId },
  });
  const conversation = await prisma.conversation.create({
    data: {
      characterId: body.characterId,
      title: body.title ?? `${character.name}との会話`,
    },
  });
  return c.json(conversation, 201);
});

app.get("/conversations", async (c) => {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: { character: true },
  });
  return c.json(conversations);
});

app.get("/conversations/:id", async (c) => {
  const id = c.req.param("id");
  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: { id },
    include: {
      character: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  return c.json(conversation);
});

app.delete("/conversations/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.message.deleteMany({ where: { conversationId: id } });
  await prisma.conversation.delete({ where: { id } });
  return c.json({ success: true });
});

// ─── Chat (streaming) ───

app.post("/chat", async (c) => {
  const body = await c.req.json<{
    conversationId: string;
    content: string;
  }>();

  // Validation
  if (!body.content || body.content.trim().length === 0) {
    return c.json({ error: "メッセージを入力してください" }, 400);
  }
  if (body.content.length > 5000) {
    return c.json({ error: "メッセージは5000文字以内で入力してください" }, 400);
  }

  // Save user message
  await prisma.message.create({
    data: {
      conversationId: body.conversationId,
      role: "user",
      content: body.content,
    },
  });

  // Load conversation with history and character
  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: { id: body.conversationId },
    include: {
      character: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  const agent = createCharacterAgent(conversation.character.systemPrompt);

  const messages = conversation.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  })) satisfies Array<{ role: "user" | "assistant"; content: string }>;

  const result = await agent.stream(messages as Parameters<typeof agent.stream>[0]);

  return streamSSE(c, async (stream) => {
    let fullContent = "";
    let id = 0;

    for await (const chunk of result.textStream) {
      fullContent += chunk;
      await stream.writeSSE({
        data: chunk,
        event: "message",
        id: String(id++),
      });
    }

    // Save assistant message after streaming completes
    await prisma.message.create({
      data: {
        conversationId: body.conversationId,
        role: "assistant",
        content: fullContent,
      },
    });

    await prisma.conversation.update({
      where: { id: body.conversationId },
      data: { updatedAt: new Date() },
    });

    await stream.writeSSE({
      data: "[DONE]",
      event: "done",
      id: String(id),
    });
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
