import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API } from "../../../utils/constants";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, req) {
        const res = await fetch(`${API}/get-token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.access = user.token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.token = token.access;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
};

export default NextAuth(authOptions);
