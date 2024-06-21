'use server';

import prisma from "@/lib/prisma"

export const setTransactionId = async (orderid:string, transactionId:string) => {

  try {

    const order = await prisma.order.update({
      where: {id: orderid},
      data: {
        transactionId
      }
    })

    if(!order) {
      return {
          ok:false,
          message: 'No se puedo encontro la orden ${orderid}'
      }
    }

    return {ok: true}
    
  } catch (error) {
      return {
        ok:false,
        message: 'No se puedo actualizar el id de la transacción'
      }
  }

}