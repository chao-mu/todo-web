import { getAuthenticatedSession } from "@/server/session";

export async function GET() {
  const session = await getAuthenticatedSession();
  return Response.json({ hi: "bye" });
}
