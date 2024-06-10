'use server';

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address:Address, userId:string) => {
  try {
    const newAddress = await createOrPreplaceAddress(address, userId)
    return {
       ok: true,
       address: address
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se Pudo Grabar la dirección'
    }
  }
}

const createOrPreplaceAddress = async (address:Address, userId:string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: {userId}
    })
    const addressToSave = {
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone:address.phone,
      city: address.city,
      postalCode: address.postalCode,
      userId: userId
    }
    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave
      })
      return newAddress
    }

    const updateAddress = await prisma.userAddress.update({
      where: {userId},
      data: addressToSave
    })

    return updateAddress
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se Pudo Grabar la dirección'
    }
    
  }
}