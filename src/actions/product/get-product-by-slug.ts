'use server';

import prisma from "@/lib/prisma";

export const getProductBySlug = async(slug:string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        // ProductImage:{
        //   select:{
        //     url: true,
        //     id: true
        //   }
        // }
        ProductImage: true
      },
      where: {
        slug: slug
      }
    })

    if(!product) return null;
    
    const{ProductImage, ...rest} = product
    return {
      ...rest,
      images: product.ProductImage.map(image => image.url),
      ProductImage: product.ProductImage.map(image => image)
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener protucto por slug')
    
  }
}