export const revalidate = 60;

import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";
import { initialData } from "@/seed/seed";
import { Gender,  Product } from "@/interfaces";
import { getPaginatedProductsWithImages } from "@/actions";


const seedProduct:Product[] = (initialData.products as unknown) as Product[]

interface Props {
  searchParams: {
    page?: string;
  },
  params: {
    gender: string;
  }
}

const labels: Record<string, string> = {
  'men': 'Hombres',
  'women': 'Mujeres',
  'kid': 'Niños',
  'unisex': 'Todos'
}

export default async function GenderPage ({params, searchParams}:Props) {

  const {gender} = params

  const page = searchParams.page ? Number(searchParams.page) : 1;
  

  const {products, currentPage, totalPages} = await getPaginatedProductsWithImages({page,gender: gender as Gender})

  if (products.length === 0) {
    redirect(`/gender/${gender}`)
  }


  return (

    <div>
      <Title title={`Artículos para ${labels[gender]}`} subtitle={`Productos para ${labels[gender]}`} className="mb-2" />

      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}