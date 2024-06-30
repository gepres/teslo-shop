'use server';

import { auth } from "@/auth"
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  const session = await auth()

  if(session?.user.role !== 'admin'){
    return {
      ok: false,
      message: 'Debe de estar autenticado'
    }
  }


  try {
    const users  = await prisma.user.findMany({
      orderBy: {
        name:'desc'
      }
    })

    return {
      ok:true,
      users
    }
  } catch (error) {
    return {
      ok: false,
      message: 'eroor'
    }
  }
}