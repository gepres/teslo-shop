import { OrderStatus, PayPalButton, QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import Image from 'next/image'
import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";
import { getOrderById } from "@/actions/order/get-order-by-id";
import { redirect } from "next/navigation";
import { Address } from "@/interfaces";
import { currencyFormat } from "@/utils";


interface Props {
  params: {
    id: string;
  }
}

export default async function OrdersIdPage({ params }: Props) {
  const { id } = params

  // todo: verficar

  const { ok, order } = await getOrderById(id)

  if (!ok) {
    redirect('/')
  }

  // console.log('order', order);

  const address: any = order!.OrderAddress


  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title
          title={`Orden #${id}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* carrito */}
          <div className="flex flex-col mt-5">
            {/* isPaid={order!.isPaid} || siempre se va a tener */}
            {/* order?.isPaid ?? false */}
          <OrderStatus isPaid={order!.isPaid} />

            {/* Items */}
            {
              order!.OrderItem.map((item, index) => (
                <div key={index} className="flex mb-5">
                  <Image src={`/products/${item.product.ProductImage[0].url}`} width={100} height={100} style={{ width: '100px', height: '100px' }} alt={item.product.title} className="mr-5 rounded-none" />

                  <div>
                    <p>{item.product.title}</p>
                    <p>${item.price} x {item.quantity}</p>
                    <p>subtotal: {currencyFormat(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            }
          </div>


          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2 font-bold">Dirrección de entregas</h2>

            <div className="mb-10">
              <p className="text-xl capitalize">
                {address.firstName} {address.lastName}
              </p>
              <p>{address.address}</p>
              <p>{address.address2}</p>
              <p>{address.postalCode}</p>
              <p>{address.city}, {address.countryId}</p>
              <p>tef: {address.phone}</p>
            </div>
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de Orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">{order?.itemsInOrder === 1 ? '1 Artículo' : `${order?.itemsInOrder} Artículos`}</span>

              <span>Subtotal</span>
              <span className="text-right"> {currencyFormat(order!.subtotal)}</span>
              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right"> {currencyFormat(order!.total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {/* <div className={
                clsx("flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": !order!.isPaid,
                    "bg-green-500": order!.isPaid
                  })
              }>
                <IoCardOutline size={30} />
                <span className="mx-2">
                  {
                    order?.isPaid ? 'Pagada' : 'Pendiente de Pago'
                  }
                </span>
              </div> */}
              {
                order?.isPaid ? 
                <OrderStatus isPaid={order!.isPaid} />
                :
                <PayPalButton amount={order!.total} orderId={order!.id} />

              }
            </div>

          </div>


        </div>
      </div>
    </div>
  );
}