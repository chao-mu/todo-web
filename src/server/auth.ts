// NextAuth.js
import DiscordProvider from "next-auth/providers/discord";
import { getServerSession } from "next-auth";
import { db } from "@/db/db";

// Auth.js
import { DrizzleAdapter } from "@auth/drizzle-adapter";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const authOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    DiscordProvider({
      clientId: getEnv("DISCORD_CLIENT_ID"),
      clientSecret: getEnv("DISCORD_CLIENT_SECRET"),
    }),
  ],
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
