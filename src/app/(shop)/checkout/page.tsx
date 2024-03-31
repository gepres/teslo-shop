import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import Image from 'next/image'
const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[3]
]


export default function () {
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
            {
              productsInCart.map(item => (
                <div key={item.slug} className="flex mb-5">
                  <Image src={`/products/${item.images[1]}`} width={100} height={100} style={{ width: '100px', height:'100px' }} alt={item.title} className="mr-5 rounded-none" />

                  <div>
                    <p>{item.title}</p>
                    <p>${item.price} x 3</p>
                    <p>subtotal: ${item.price * 3}</p>
                  </div>
                </div>
              ))
            }
         </div>


            <div className="bg-white rounded-xl shadow-xl p-7">

              <h2 className="text-2xl mb-2 font-bold">Dirrección de entregas</h2>

              <div className="mb-10">
                <p className="text-xl">Genaro Pretill</p>
                <p>Av. lisboa 362</p>
                <p>Ica</p>
                <p>Perú</p>
                <p>110101</p>
                <p>tef: 984 384 454</p>
              </div>

              <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


              <h2 className="text-2xl mb-2">Resumen de Orden</h2>

              <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">3 Articulos</span>

                <span>Subtotal</span>
                <span className="text-right">$ 100</span>
                <span>Impuestos (15%)</span>
                <span className="text-right">$ 100</span>
                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">$ 100</span>
              </div>

              <div className="mt-5 mb-2 w-full">

                <p className="mb-5">
                  <span className="text-xs">
                    Al hacer click en "Colocar orden", aceptas nuestrs <a href="#" className="underline">terminos y condiciones</a> y <a href="#" className="underline">politicas privadas</a>.
                  </span>
                </p>

                <Link href="/orders/123" className="flex btn-primary justify-center">Colocar orden</Link>
              </div>

            </div>


        </div>
      </div>
    </div>
  );
}