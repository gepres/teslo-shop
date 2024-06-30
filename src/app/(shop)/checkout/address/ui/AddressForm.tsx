'use client';

import { deleteUserAddress, setUserAddress } from '@/actions';
import { Address, Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';


type  FormInputs = {
  firstName: string
  lastName: string
  address: string
  address2: string
  postalCode: string
  city: string
  country: string
  phone: string
  remenberAddress: boolean
}

interface Props {
  countries: Country[];
  userStoredAddress?: Partial<Address>
}

export const AddressForm = ({countries, userStoredAddress = {}}:Props) => {


  const { handleSubmit, register, formState:{isValid}, reset } = useForm<FormInputs>({
    defaultValues: {
      ...(userStoredAddress as any),
      remenberAddress: false
    }
  })

  const router = useRouter()

    const {data:session} = useSession({
      required: true
    })

  const setAddress = useAddressStore(state => state.setAddress)
  const address = useAddressStore(state => state.address)


  if (session?.user.id) {
    
  }

  
  const onSubmit = async (data:FormInputs) => {
    // console.log('data',data);
    const {remenberAddress, ...restAddress} = data
    setAddress(restAddress)
    if(data.remenberAddress) {
      await setUserAddress(restAddress, session!.user.id)
    } else {
      await deleteUserAddress(session!.user.id)
    }

    router.push('/checkout')
  }

  useEffect(() => {
    if(address.firstName) {
      reset(address)
    }
  }, [address, reset])

  const rules = {
    firstName:{
      required: 'campo obligario'
    },
    lastName:{
      required: 'campo obligario'
    },
    address:{
      required: 'campo obligario'
    },
    address2:{
      required: 'campo obligario'
    },
    postalCode:{
      required: 'campo obligario'
    },
    city:{
      required: 'campo obligario'
    },
    country:{
      required: 'campo obligario'
    },
    phone:{
      required: 'campo obligario'
    },
    remenberAddress:{
      required: false
    },
  }





  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">


          <div className="flex flex-col mb-2">
            <span>Nombres</span>
            <input 
              type="text" 
              className="p-2 border  focus:outline-none focus:border-indigo-500/50 rounded-md bg-gray-200"
              {...register('firstName',rules.firstName)}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Apellidos</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              {...register('lastName', rules.lastName)}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Dirección</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              {...register('address', rules.address)}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Dirección 2 (opcional)</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              {...register('address2')}
            />
          </div>


          <div className="flex flex-col mb-2">
            <span>Código postal</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              {...register('postalCode', rules.postalCode)}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Ciudad</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              {...register('city', rules.city)}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>País</span>
            <select 
              className="p-2 border rounded-md bg-gray-200"
              {...register('country', rules.country)}
            >
              <option value="">[ Seleccione ]</option>
              {
                countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))
              }
            </select>
          </div>

          <div className="flex flex-col mb-2">
            <span>Teléfono</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              {...register('phone', rules.phone)}
            />
          </div>



          <div className="flex flex-col mb-2 sm:mt-1">
            <div className="inline-flex items-center mb-10">
              <label
                className="relative flex cursor-pointer items-center rounded-full p-3"
                htmlFor="checkbox"
                data-ripple-dark="true"
              >
                <input
                  type="checkbox"
                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                  id="checkbox"
                  {...register('remenberAddress')}
                />
                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </label>
              <span>¿ Recordar dirección ?</span>
            </div>
            <button 
            disabled={!isValid}
              type='submit'
              className={
                clsx('flex w-full sm:w-1/2 justify-center',
                  {
                  'btn-primary': isValid,
                  'btn-disabled': !isValid
                })
              }>
              Siguiente
            </button>
          </div>


        </form>

  )
}
