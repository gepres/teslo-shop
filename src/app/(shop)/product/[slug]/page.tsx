import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, SizeSelector } from "@/components"
import { titleFont } from "@/config/fonts"
import { Product } from "@/interfaces"
import { initialData } from "@/seed/seed"
import { notFound } from "next/navigation"

interface Props {
  params: {
    slug: string
  }
}



export default function ProductSlugPage ({params}:Props) {
  const { slug } = params
  const product:Product  = (initialData.products.find(item => item.slug === slug) as any) as Product
  if (!product) {
    notFound()
  }
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow title={product.title} images={product.images} className="block md:hidden" />

        {/* Desktop Slideshow */}
        <ProductSlideshow title={product.title} images={product.images} className="hidden md:block" />
      </div>
      <div className="col-span-1 px-5">
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
        <p className="textr-lg mb-5">${product.price}</p>

        <SizeSelector selectedSize={product.sizes[0]} availableSizes={product.sizes} />

        <QuantitySelector quantity={1} />
        <button className="btn-primary my-5">
          Agregar al carrito
        </button>

        <h3 className="font-bold text-sm">descripción</h3>
        <p className="font-light">
          {product.description}
        </p>
      </div>
      {/* detalles */}
    </div>
  )
}
