import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import OTP from "@/models/Otp";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        action: { label: "Action", type: "text" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
      },

      async authorize(credentials) {
        try {
          await connectDB();

          const { email, otp, action, name, role } = credentials;

          if (!email || !otp) {
            throw new Error("Missing email or OTP");
          }

          const normalizedEmail = email.toLowerCase().trim();

          const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            otp,
          });

          if (!otpRecord) {
            throw new Error("Invalid or expired OTP");
          }

          if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ _id: otpRecord._id });
            throw new Error("OTP has expired");
          }

          await OTP.deleteOne({ _id: otpRecord._id });

          if (action === "register") {
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
               throw new Error("User already exists");
            }

            // Create new user since OTP is verified
            const newUser = await User.create({
               name: name || "New User",
               email: normalizedEmail,
               role: role || "Both",
            });

            return {
              id: newUser._id.toString(),
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
            };
          } else {
            // Login flow
            const user = await User.findOne({ email: normalizedEmail });

            if (!user) {
              throw new Error("User not found");
            }

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } catch (err) {
          console.log("AUTH ERROR:", err.message);
          throw err;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (!session.user) session.user = {};
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  debug: false,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
