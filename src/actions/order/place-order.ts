'use server';

import { auth } from "@/auth";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";


interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}


export const placeOrder = async(productIds: ProductToOrder[], address: Address) => {

  const session = await auth()

  const userId = session?.user.id
  if (!userId) {
    return {
      ok: false,
      message: 'No hay sesión de usuario'
    }
  }
  // console.log({productIds});
  

  // obtener información de los productos
  const products = await prisma.product.findMany({
    where:{
      id: {
        in: productIds.map(p => p.productId)
      }
    }
  })

  // console.log({products});
  
  // calcular los montos 
  const itemsInOrder = productIds.reduce((count, p) =>  count + p.quantity, 0)

  // console.log({itemsInOrder});
  

  // tax total subtotal
  const {subtotal,tax,total} = productIds.reduce((totals, item) => {
    const productQuantity = item.quantity;
    const product = products.find(product => product.id === item.productId)

    if(!product) throw new Error (`${item.productId} no existe - 500`)

    const subtotal = product.price * productQuantity

    totals.subtotal += subtotal;
    totals.tax += subtotal * 0.15
    totals.total += subtotal * 1.15

    return totals
  }, {subtotal:0, tax:0, total: 0})

  // console.log({subtotal,tax,total});


  // crear la transasión de base de datos
  try {

    const prismaTx = await prisma.$transaction(async(tx) => {
  
      // 1. actualizar el stock de los productos
  
      const updateProductsPromises = products.map(async (product) => {
        
        // acumular los valores
        const productQuantity = productIds.filter(
          p => p.productId === product.id
          ).reduce((acc, item) => item.quantity + acc, 0)
          

        if(productQuantity === 0) {
          throw new Error(`${product.id}, no tiene cantidad definida`)
        }
        
        return tx.product.update({
          where: {
            id: product.id
          },
          data: {
            inStock: {
              decrement: productQuantity
            }
            
          }
        })
      })
  
  
      const updateProducts = await Promise.all(updateProductsPromises)
  
      // verificar valores negativos - no hay stock
  
      updateProducts.forEach(product => {
        if(product.inStock < 0) {
          throw new Error(`${product.title}, no tiene invertario sufciente`)
        }
      })
  
  
      // 2. crear la orden - encabezado -detalles
      const order = await tx.order.create({
        data:{
          userId: userId,
          itemsInOrder: itemsInOrder,
          subtotal: subtotal,
          tax:tax,
          total:total,
  
          OrderItem: {
            createMany:{
              data: productIds.map(product => ({
                quantity: product.quantity,
                size: product.size,
                productId: product.productId,
                price: products.find(prod => prod.id === product.productId)?.price ?? 0
              }))
            }
          }
        }
      })
  
      // validar si hay un price con cero, lanzar error 
  
      // 3. crear la dirección de la orden
      const {country, ...restAddress} = address
      // console.log({ ...restAddress});
      const orderAddress = await tx.orderAddress.create({
        data: {
          countryId:country,
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          postalCode:address.postalCode,
          phone: address.phone,
          city: address.city,
          address2:address.address2,
          orderId: order.id
        }
      })
  
  
      return {
        order:order,
        orderAddress:orderAddress,
        updateProducts: updateProducts
      }
      
  
    })
    return {
      ok:true,
      order:prismaTx.order.id,
      prismaTx:prismaTx
    }
    
  } catch (error:any) {
    return {
      ok: false,
      message:error?.message
    }
  }

  
}