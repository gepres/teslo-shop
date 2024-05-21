"use server"

import { sleep } from '@/utils';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    sleep()
    console.log('data', formData);
    console.log('formData', Object.fromEntries(formData));
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'success'


  } catch (error) {
    console.log(error);
    if((error as any).type === 'CredentialsSignin') {
      // return  { code: 'CredentialsSignin', message: 'Error desconocido'}
      return 'CredentialsSignin'
    }
    return 'invalid'
    // return {code: 'undefined', message: 'Error desconocido'}
    
    // if (error instanceof AuthError) {
      // switch (error.type) {
      //   case 'CredentialsSignin':
      //     return 'Invalid credentials.';
      //   default:
      //     return 'Something went wrong.';
      // }
    // }

  }
}


export const login = async(email:string, password:string) => {
  
  
  try {
    await signIn('credentials',{email,password})

    return {
      ok:true
    }

  } catch (error) {
      console.log(error);
      return {
        ok:true,
        message: 'No se pudo iniciar sessión'
      }
  
  }
}