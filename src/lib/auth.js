import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import  prisma  from "./prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    // Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Email + Password Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("No user found");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");
        return user;
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
  async signIn({ user, account, profile }) {
    if (account.provider === "google") {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            image: profile.picture, 
            password: "",           
          },
        });
      } else if (!existingUser.image) {
        await prisma.user.update({
          where: { email: user.email },
          data: { image: profile.picture },
        });
      }
    }
    return true;
  },

  async session({ session }) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    session.user.id = user?.id;
    session.user.image = user?.image; 
    return session;
  },
},

};
