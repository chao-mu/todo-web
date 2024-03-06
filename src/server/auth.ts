// NextAuth.js
import DiscordProvider from "next-auth/providers/discord";
import type { DefaultSession, NextAuthOptions } from "next-auth";

import { db } from "@/db/db";

// Auth.js
import { DrizzleAdapter } from "@auth/drizzle-adapter";

// NextAuth.js
import type { Adapter } from "next-auth/adapters";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: getEnv("DISCORD_CLIENT_ID"),
      clientSecret: getEnv("DISCORD_CLIENT_SECRET"),
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
};
