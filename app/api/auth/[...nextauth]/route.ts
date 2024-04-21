import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

// FIXME: Figure out why this esling bypass is necessary
// eslint-disabl-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
