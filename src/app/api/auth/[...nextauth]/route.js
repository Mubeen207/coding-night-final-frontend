import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getByEmail, verifyPassword } from "@/lib/users";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const user = await getByEmail(credentials?.email);
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };