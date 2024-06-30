import {  getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductImage, Title } from '@/components';
import clsx from 'clsx';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { currencyFormat } from '../../../../utils/currencyFormat';


interface Props {
  searchParams: {
    page?: String;
  }
}

export default async function ProductPage({searchParams}: Props) {

  const page = searchParams.page ? Number(searchParams.page) : 1;

  const {products, currentPage, totalPages} = await getPaginatedProductsWithImages({page})


  if (products.length === 0) {
    redirect('/')
  }




  return (
    <>
      <Title title="Mantenimientos de productos" />

      <div className='flex justify-end mb-5'>

        <Link href="/admin/product/new" className='btn-primary'>
          Nuevo producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Imagen
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Titulo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Precio
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Género
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Intentario
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Sizes
              </th>
            </tr>
          </thead>
          <tbody>


            {
              products.map(item => (

                <tr key={item.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/product/${item.slug}`}>
                    <ProductImage src={item.ProductImage[0]?.url} width={80} height={80} alt={item.title} className='w-20 h-20 object-cover round`' />
                    </Link>
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/product/${item.slug}`} className='hover:underline'>
                    {item.title}
                    </Link>
                  </td>
                  <td className=" text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    <p>{currencyFormat(item.price)}</p>
                  </td>
                  <td className=" text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.gender}
                  </td>
                  <td className=" text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    {item.inStock}
                  </td>
                  <td className=" text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    {item.sizes.join(', ')}
                  </td>
                </tr>
              ))


            }

          </tbody>
        </table>

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}