import NextAuth from "next-auth"
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from "@/lib/prisma";
import bcryptjs from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //     const isLoggedIn = !!auth?.user;
    //     console.log('auth',auth);
        
    //     // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    //     // if (isOnDashboard) {
    //     //   if (isLoggedIn) return true;
    //     //   return false; // Redirect unauthenticated users to login page
    //     // } else if (isLoggedIn) {
    //     //   return Response.redirect(new URL('/dashboard', nextUrl));
    //     // }
    //     return true;
    // },
    jwt ({token , user}) {
      // console.log({token,user});
      if(user) {
        token.data = user
      }
      return token
    },
    async session ({session, token ,user}) {
      // console.log({session, token ,user});
      session.user = token.data as any
      return session
    }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);


          if(!parsedCredentials.success) return null;

          const {email, password } =  parsedCredentials.data

          const user  = await prisma.user.findUnique({where: {email: email.toLocaleLowerCase()}})
         
          if(!user) return null

          if(!bcryptjs.compareSync(password, user.password)) return null

          const {password:_, ...rest} = user
          // console.log('rest',rest);
          
          return rest
      },
    }),
  ],
})