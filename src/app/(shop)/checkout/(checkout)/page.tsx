import { Title } from "@/components";
import Link from "next/link";
import Image from 'next/image'
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";


export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title
          title='Verificar orden'
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* carrito */}
          <div className="flex flex-col mt-5">
            <div className="text-xl">Ajustar elemento</div>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {/* Items */}
            <ProductsInCart />
         </div>

          <PlaceOrder />



        </div>
      </div>
    </div>
  );
}