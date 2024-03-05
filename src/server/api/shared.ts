// Zod
import { z } from "zod";

// NextAuth
import type { Session } from "next-auth";

// Ours
import { getAuthenticatedSession } from "@/server/auth";

export type APIError = { error: string };
export type APISuccess<T> = { data: T };
export type APIResponse<T> = APIError | APISuccess<T>;

export type ProtectedFunc<I, O> = ({
  session,
  input,
}: {
  session: Session;
  input: I;
}) => Promise<O>;

export function isAPIError(e: unknown): e is APIError {
  return (e as APIError)?.error !== undefined;
}

export function protectedProcedure<Z extends z.ZodTypeAny, O>(
  schema: Z,
  f: ProtectedFunc<z.infer<Z>, O>,
) {
  return async (rawInput: z.infer<Z>) => {
    const session = await getAuthenticatedSession();

    if (!session) {
      throw new Error("Unauthenticated access to protected endpoint");
    }

    const input = schema.safeParse(rawInput);

    try {
      const res = await f({ session, input });
      if (isAPIError(res)) {
        return res;
      }

      return { data: res };
    } catch (e) {
      if (isAPIError(e)) {
        return e;
      }

      throw e;
    }
  };
}

export const noArgs = z.object({});
