import { convertToModelMessages, createUIMessageStreamResponse, isStepCount, streamText, toUIMessageStream } from "ai";
import { buildSystemPrompt, CHAT_MODEL, rateLimit, sanitizeMessages, tools } from "@/lib/ai";

const MAX_BODY = 256 * 1024;
const offline = () => Response.json({ error: "offline" }, { status: 503 });
const tooBig = () => Response.json({ error: "Too large" }, { status: 413 });
// On Vercel the gateway authenticates with OIDC; locally it needs AI_GATEWAY_API_KEY.
const hasGateway = () => !!(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!rateLimit(ip)) return Response.json({ error: "Too many messages, try again in a few minutes" }, { status: 429 });

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return tooBig();
  const raw = await req.text().catch(() => "");
  if (Buffer.byteLength(raw) > MAX_BODY) return tooBig(); // header can be missing or lie
  let body: { messages?: unknown } | null = null;
  try { body = JSON.parse(raw); } catch { /* falls through to 400 */ }
  const clean = sanitizeMessages(body?.messages);
  if ("error" in clean) return Response.json({ error: clean.error }, { status: 400 });
  if (!hasGateway()) return offline();

  try {
    const result = streamText({
      model: CHAT_MODEL,
      // Built on the server only; anything role:"system" from the client was dropped above.
      instructions: { role: "system", content: buildSystemPrompt(), providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } } },
      messages: await convertToModelMessages(clean.messages),
      tools,
      stopWhen: isStepCount(5),
      maxOutputTokens: 800,
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream, onError: (e) => {
        // Logged so the owner can see in Vercel logs why the assistant is offline; visitors only see "offline".
        console.error("chat stream failed:", e instanceof Error ? e.message : String(e));
        return "offline";
      } }),
    });
  } catch (e) {
    console.error("chat failed:", e instanceof Error ? e.message : String(e));
    return offline();
  }
}
