'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import {CreateOrderData,CreateOrderActions,OnApproveData,OnApproveActions} from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from "@/actions";



interface Props {
  orderId: string;
  amount: number
}

export const PayPalButton = ({amount,orderId}:Props) => {


  const [{isPending}] = usePayPalScriptReducer()

  const rounterAmount = (Math.round(amount * 100)) / 100

  if(isPending){
    return (
      <div className="animate-pulse">
        <div className="h-11 bg-gray-300 rounded" />
        <div className="h-11 bg-gray-300 rounded mt-2" />
      </div>
    )
  }
  console.log('rounterAmount',rounterAmount);
  

  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions):Promise<string> => {


    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
       {
        invoice_id: orderId,
        amount: {
          currency_code: 'USD',
          value: rounterAmount.toString(),
        }
       }
      ]
    })

    // setTransaction
    const { ok } = await setTransactionId(orderId, transactionId)
    if(!ok) {
      throw new Error('No se pudo actualizar la orden')
    }

    return transactionId
  }

  const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {

    const details:any = await actions.order?.capture()
    if (!details) {
      return
    }
    await paypalCheckPayment(details.id)
  }

  return (
    <PayPalButtons createOrder={createOrder} onApprove={onApprove} /> 
  )
}
