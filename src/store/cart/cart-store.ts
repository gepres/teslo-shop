import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface state {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInformation: () => {
    subsTotal:number;
    tax:number;
    total:number;
    itemsInCart:number;
  };
  addProductToCart: (product: CartProduct) => void
  updateProductQuantity:(product:CartProduct, quantity: number) => void
  removeProduct:(product:CartProduct) => void
  clearCart:() => void
}

export const useCartStore = create<state>()(
  persist(
    (set,get) => ({
      cart: [],
      getTotalItems: () => {
        const {cart} = get()
        return cart.reduce((total,item) => total + item.quantity, 0)
      },

      getSummaryInformation: () => {
        const {cart} = get();
        const subsTotal = cart.reduce((subtotal, product) => (product.quantity * product.price) + subtotal , 0)
        const tax = subsTotal * 0.15;
        const total = subsTotal + tax;
        const itemsInCart = cart.reduce((total,item) => total + item.quantity, 0)
        

        return {
          subsTotal, tax,total,itemsInCart
        }
      },
      addProductToCart: (product: CartProduct) => {
        const {cart} = get()
  
        console.log(cart);
        
        // 1. REvisar si el producto existe en el carrito con la talla seleccionada
        const productInCart = cart.some(
          item =>  item.id === product.id && item.size === product.size
        )
  
        if(!productInCart){
          set({ cart: [...cart, product]})
          return
        }
  
        // 2. Se que el producto existe por talla... tengo que incrementar 
        const updateCartProducts = cart.map( (item) => {
  
          if(item.id === product.id && item.size === product.size) {
            return {...item, quantity: item.quantity + product.quantity}
          }
  
          return item;
        })
  
        set({cart: updateCartProducts})
      },
      updateProductQuantity: (product:CartProduct, quantity: number) => {
        const {cart} = get()
  
        const updateCartProducts = cart.map( (item) => {
  
          if(item.id === product.id && item.size === product.size) {
            return {...item, quantity: quantity}
          }
  
          return item;
        })
        set({cart: updateCartProducts})
        
      },

      clearCart: () => {
        set({cart:[]})
      },

      removeProduct:(product:CartProduct) => {
        const {cart} = get()

        console.log('remove',product);
        const removeProductInCart = cart.filter( (item) => item.id !== product.id || item.size !== product.size)
        
        set({cart: removeProductInCart})
      }
    })

    ,{
      name: 'shopping-cart'
    }
  )
  
)
