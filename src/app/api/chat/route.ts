import { convertToModelMessages, createUIMessageStreamResponse, isStepCount, streamText, toUIMessageStream } from "ai";
import { buildSystemPrompt, CHAT_MODEL, chatTools, rateLimit, sanitizeMessages, transcriptOf } from "@/lib/ai";

const offline = () => Response.json({ error: "offline" }, { status: 503 });
// On Vercel the gateway authenticates with OIDC; locally it needs AI_GATEWAY_API_KEY.
const hasGateway = () => !!(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!rateLimit(ip)) return Response.json({ error: "Too many messages, try again in a few minutes" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const clean = sanitizeMessages(body?.messages);
  if ("error" in clean) return Response.json({ error: clean.error }, { status: 400 });
  if (!hasGateway()) return offline();

  let messages;
  try {
    messages = await convertToModelMessages(clean.messages, { ignoreIncompleteToolCalls: true });
  } catch {
    return Response.json({ error: "Bad message" }, { status: 400 });
  }
  try {
    const result = streamText({
      model: CHAT_MODEL,
      // Built on the server only; anything role:"system" from the client was dropped above.
      instructions: { role: "system", content: buildSystemPrompt(), providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } } },
      messages,
      tools: chatTools(transcriptOf(clean.messages)),
      stopWhen: isStepCount(5),
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream, onError: () => "offline" }),
    });
  } catch {
    return offline();
  }
}
