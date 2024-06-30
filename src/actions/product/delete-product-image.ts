'use server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

 cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId:number, imageURL:string) => {

  if (!imageURL) {
    return {
      ok: false,
      message: 'No se puede eliminar'
    }
  }
  
  const imageName = imageURL
    .split('/')
    .pop()
    ?.split('.')[0] ?? ''


  try {

    await cloudinary.uploader.destroy(imageName)
    const deleteImage = await prisma.productImage.delete({
      where: {
        id: imageId
      },
      select: {
        product: {
          select: {
            slug: true
          }
        }
      }
    })


    revalidatePath('/admin/products')
    revalidatePath(`/admin/product/${deleteImage.product.slug}`)
    revalidatePath(`/product/${deleteImage.product.slug}`)
    
  } catch (error) {
    return {
      ok: false,
      message: 'No se puede eliminar'
    }
  }
  
  
  console.log({imageName});
  
}