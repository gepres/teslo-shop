'use server';

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransationId: string) => {
  const authToken = await getPayPalBearerToken()
  // console.log({ authToken });
  if (!authToken) {
    return {
      ok: false,
      message: 'No se puedo obtener token'
    }
  }

  const resp = await verifyPayPalPayment(paypalTransationId, authToken)

  if (!resp) {
    return {
      ok: false,
      message: 'Error al verificar el pago'
    }
  }

  const {status, purchase_units} = resp
  const {invoice_id:orderId} = purchase_units[0]

  if (status !=='COMPLETED') {
    return {
      ok: false,
      message: 'Aún no sea pagado el Paypal'
    }
  }

  try {
    // console.log(status, purchase_units);
    await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    })

    // revalidar el path

    revalidatePath(`/order/${orderId}`)

    return {
      ok: true
    }
    
  } catch (error) {
    return {
      ok: false,
      message: 'El pago del Paypal no se pudo realizar'
    }
  }



}

const getPayPalBearerToken = async (): Promise<string | null> => {

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? ''

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64')


  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded
  };

  try {
    const result = await fetch(PAYPAL_OAUTH_URL, 
      {
        ...requestOptions,
        cache: 'no-store'
      }
    ).then(r => r.json())

    return result.access_token


  } catch (error) {
    console.log('error', error);

    return null
  }
}

const verifyPayPalPayment = async (paypalTransationId: string, bearerToken: string):Promise<PayPalOrderStatusResponse|null> => {

  const PAYPAL_ORDERS_URL = process.env.PAYPAL_ORDERS_URL ?? ''

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders
  };

  try {
    const res = await fetch(`${PAYPAL_ORDERS_URL}/${paypalTransationId}`, {
      ...requestOptions,
      cache: 'no-store'
    }).then(r => r.json())

    return res

  } catch (error) {
    console.log('error', error);

    return null
  }

}