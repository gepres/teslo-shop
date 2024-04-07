'use client';
import Link from 'next/link';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import React from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline, IoChevronUpOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { generatePaginationNumbers } from '@/utils';

interface Props {
  totalPages: number;
}



export const Pagination = ({ totalPages }: Props) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const pageString = searchParams.get('page') ?? 1;
    let currentPage = isNaN(+pageString) ? 1 : +pageString
    
    
    if(currentPage < 1 || isNaN(+pageString)) {
      // currentPage = 1
      redirect(pathname)
    }

    
    
  const allPages = generatePaginationNumbers(currentPage, totalPages)

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)

    if(pageNumber === '...') {
      return `${pathname}?${params.toString()}`
    }

    if(+pageNumber <= 0) {
      return `${pathname}`
    }

    if(+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`
    }

    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }




  return (
    <div className="flex text-center justify-center mt-10 mb-32">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          <li className="page-item">
            <Link className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage - 1)} aria-disabled="true">
              <IoChevronBackOutline size={30} />
            </Link>
          </li>

          {
            allPages.map((page,index) => (
              <li key={page} className="page-item active">
              <a
              className={
                clsx('page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded mx-1 hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md',
                  {
                    'bg-blue-600 text-white': page === currentPage
                  }
                )
              }
              href={createPageUrl(page)}>
                {page}
                </a>
            </li>

            ))
          }



          <li 
          className={clsx('page-item ', {'disabled': currentPage === totalPages})}
          ><Link
            className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
            href={createPageUrl(currentPage + 1)}>
            <IoChevronForwardOutline size={30} />
          </Link></li>
        </ul>
      </nav>
    </div>
  )
}
