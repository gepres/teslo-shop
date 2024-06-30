import type { NextAuthConfig } from 'next-auth';
import { redirect } from 'next/navigation';
 
export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // console.log({auth});
      // console.log({nextUrl});
      
      const isOnCheckout= nextUrl.pathname.startsWith('/checkout');
      // console.log({isOnCheckout});
      
      // if (isOnCheckout) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/checkout', nextUrl));
      // }
      if (isOnCheckout) {
        if (!isLoggedIn)  {
          return Response.redirect(new URL('/auth/login', nextUrl));
        };
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;