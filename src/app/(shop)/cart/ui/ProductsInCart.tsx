'use client';
import { QuantitySelector } from "@/components";
import { CartProduct } from "@/interfaces";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export const ProductsInCart = () => {
  const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
  const removeProduct = useCartStore(state => state.removeProduct)
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
              <Link className="hover:underline cursor-pointer" href={`/product/${item.slug}`}>

              {item.size} - {item.title}
              </Link>
              <p>${item.price}</p>
              <QuantitySelector quantity={item.quantity} onQuantityChanged={(value) => updateProductQuantity(item, value)} />
              <button className="underline mt-3" onClick={() => removeProduct(item)}>
                Remover
              </button>
            </div>
          </div>
        ))
      }
    </>
  )
}
