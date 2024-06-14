'use client';
import { useCartStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { currencyFormat } from '../../../../../utils/currencyFormat';


export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false)
  const productsInCart = useCartStore(state => state.cart)

  useEffect(() => {
    setLoaded(true)
  }, [])


  if(!loaded) {
    return <p>Loading...</p>
  }


  return (
    <>
      {
        productsInCart.map(item => (
          <div key={`${item.slug}-${item.size}`} className="flex mb-5">
            <Image src={`/products/${item.image}`} width={100} height={100} style={{ width: '100px', height: '100px' }} alt={item.title} className="mr-5 rounded-none" />

            <div>
              <span className="">

              {item.size} - {item.title} ({item.quantity})
              </span>
              <p className="font-bold">${currencyFormat(item.price * item.quantity)}</p>
            </div>
          </div>
        ))
      }
    </>
  )
}
