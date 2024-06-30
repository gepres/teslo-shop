'use client';

import { login, registerUser } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';


type FormInputs = {
  name: string;
  email: string;
  password: string;
}

export const RegisterForm = () => {

  const router = useRouter()

  const [errorMessage,setErrorMessage] =   useState('')

  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const {register, handleSubmit, formState:{errors}} = useForm<FormInputs>()

  const onSubmit:SubmitHandler<FormInputs> = async (data) => {

    setErrorMessage('')
    setLoadingSubmit(true)

    const {name , email, password} = data 

    // console.log({name , email, password});

    const res = await registerUser(name , email, password)
    // console.log(res);
    
    if(!res.ok) {
      setErrorMessage(res.message)
      return
    }

    await login(email.toLocaleLowerCase(), password)

    // router.replace('/')

    setLoadingSubmit(false)
    window.location.replace('/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {/* {
        errors.name?.type === 'required' && (
          <span className='text-red-500'>*  El Nombre es Obligatorio</span>
        )
      } */}

    <label htmlFor="name">Nombre completo</label>
    <input
      className={
        clsx(
          "px-5 py-2 border bg-gray-200 rounded mb-5",
          {
            'border-red-500':errors.name
          }
        )
      }
      type="text" 
      autoFocus
      {...register('name',{required:true})}
      />

      
    <label htmlFor="email">Correo electrónico</label>
    <input
      className={
        clsx(
          "px-5 py-2 border bg-gray-200 rounded mb-5",
          {
            'border-red-500':errors.email
          }
        )
      }
      type="email" {...register('email',{required:true})} />


    <label htmlFor="password">Contraseña</label>
    <input
      className={
        clsx(
          "px-5 py-2 border bg-gray-200 rounded mb-5",
          {
            'border-red-500':errors.password
          }
        )
      }
      type="password" {...register('password',{required:true})} />



          <span className='text-red-500'>* {errorMessage}</span>

    <button
      
      className="btn-primary">
      Nueva cuenta
      {
        loadingSubmit && (
          <>
            <span>...loading</span>
          </>
        )
      }
    </button>


    {/* divisor l ine */ }
    <div className="flex items-center my-5">
      <div className="flex-1 border-t border-gray-500"></div>
      <div className="px-2 text-gray-800">O</div>
      <div className="flex-1 border-t border-gray-500"></div>
    </div>

    <button
      
      className="btn-secondary text-center">
      Ingresar
    </button>

  </form>
  )
}
