'use server';

import prisma from "@/lib/prisma";
import { sleep } from "@/utils";

export const getStockBySlug = async(slug:string): Promise<number> => {
  try {
    const stock = await prisma.product.findFirst({
      where: {
        slug: slug
      },
      select:{
        inStock: true
      }
    })

    if(!stock) return null;
    
    // await sleep()

    return stock?.inStock ?? 0;


  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener protucto por slug')
    
  }
}