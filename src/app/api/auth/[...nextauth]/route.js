import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { db } from '@/lib/database';

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db.getUserByEmail(credentials.email);
          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            profession: user.profession,
            profilePic: user.profilePic
          };
        } catch (error) {
          console.error('Auth error:', error.message);
          // Return null instead of throwing to prevent auth failure
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.profession = user.profession;
        token.profilePic = user.profilePic;
      }
      if (trigger === 'update' && session) {
        const updatedUser = await db.getUserById(token.sub);
        if (updatedUser) {
          token.name = updatedUser.name;
          token.profession = updatedUser.profession;
          token.profilePic = updatedUser.profilePic;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.status = token.status;
      session.user.profession = token.profession;
      session.user.profilePic = token.profilePic;
      session.user.name = token.name;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };