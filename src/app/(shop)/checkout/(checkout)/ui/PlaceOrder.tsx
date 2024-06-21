'use client';

import { useEffect, useState } from "react";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat, sleep } from "@/utils";
import clsx from 'clsx';
import { placeOrder } from "@/actions";
import { useRouter } from 'next/navigation';


export const PlaceOrder = () => {

  const [loaded, setLoaded] = useState(false)
  const router = useRouter()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const address = useAddressStore(state => state.address)

  const {itemsInCart, subsTotal, total, tax} = useCartStore(state => state.getSummaryInformation())

  const cart = useCartStore(state => state.cart)
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    setLoaded(true)
  },[])

  const OnPlaceOrder = async() => {
    
    setIsPlacingOrder(true)
    
    const productsToOrder = cart.map( product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size
    }))
    // console.log({productsToOrder,address});
    
    const resp =  await placeOrder(productsToOrder,address)
    // console.log('resp',resp);
    if (!resp.ok) {
      setIsPlacingOrder(false)
      setErrorMessage(resp.message)
      return
    }
    setIsPlacingOrder(false)
    clearCart()
    router.replace('/orders/' + resp.order)
  }

  if(!loaded) {
    return <p>Cargando...</p>
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">

    <h2 className="text-2xl mb-2 font-bold">Dirección de entregas</h2>

    <div className="mb-10">
      <p className="text-xl capitalize">
        {address.firstName} {address.lastName}
      </p>
      <p>{address.address}</p>
      <p>{address.address2}</p>
      <p>{address.postalCode}</p>
      <p>{address.city}, {address.country}</p>
      <p>tef: {address.phone}</p>
    </div>

    <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


    <h2 className="text-2xl mb-2">Resumen de Orden</h2>

    <div className="grid grid-cols-2">
      <span>No. Productos</span>
        <span className="text-right">{itemsInCart === 1 ? '1 Artículo': `${itemsInCart} Artículos`}</span>

        <span>Subtotal</span>
        <span className="text-right"> {currencyFormat(subsTotal)}</span>
        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>
        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right"> {currencyFormat(total)}</span>
    </div>

    <div className="mt-5 mb-2 w-full">

      <p className="mb-5">
        <span className="text-xs">
          Al hacer click en  &quot;Colocar orden&quot;, aceptas nuestrs <a href="#" className="underline">terminos y condiciones</a> y <a href="#" className="underline">politicas privadas</a>.
        </span>
      </p>

      <p className="text-red-500">
        {errorMessage}
      </p>
      {/* href="/orders/123" */}
      <button onClick={OnPlaceOrder}
      className={
        clsx({
          'btn-primary': !isPlacingOrder,
          'btn-disabled': isPlacingOrder
        })
      }
      >Colocar orden</button>
    </div>

  </div>
  )
}
