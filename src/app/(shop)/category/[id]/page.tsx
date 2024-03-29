'use client';

import { ProductGrid, Title } from "@/components";
import { notFound } from "next/navigation";
import { initialData } from "@/seed/seed";
import { Category, Product } from "@/interfaces";


const seedProduct:Product[] = (initialData.products as unknown) as Product[]

interface Props {
  params: {
    id: Category
  }
}

// const nameCategory = (id: string) => {
//   let value
//   switch (id) {
//     case 'men':
//       value = 'hombres'
//       break;
//       case 'women':
//         value = 'Mujeres'
//         break;
//         case 'kid':
//           value = 'Niños'
//           break;
//     default:
//       break;
//   }
//   return value
// }

const nameCategory: Record<Category, string> = {
  'men': 'Hombres',
  'women': 'Mujeres',
  'kid': 'Niños',
  'unisex': 'Todos'
}

export default function ({params}:Props) {
  const {id} = params
  const products = seedProduct.filter((item) => item.gender === id )
  // if(id === 'kids') {
  //   notFound()
  // }


  return (
    // ${nameCategory(id)}`}
    <div>
      <Title title={`Artículos para ${nameCategory[id]}`} subtitle={`Productos para ${nameCategory[id]}`} className="mb-2" />

      <ProductGrid products={products} />
    </div>
  );
}