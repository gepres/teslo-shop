"use client";

import { Category, Gender, Product, ProductImage as ProductWithImage } from "@/interfaces";
import { useForm } from "react-hook-form";
import Image from 'next/image';
import clsx from "clsx";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components";



interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[]};
  categories: Category[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: Gender;
  categoryId: string;
  images?:FileList;
}





export const ProductForm = ({ product,categories }: Props) => {


  const router = useRouter();


  const {handleSubmit, register, formState:{isValid}, getValues, setValue,watch} = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      images: undefined
    }
  })

  watch('sizes')


  const onSizeChanged = (size:string) => {
    const sizes = new Set(getValues('sizes'));
    console.log({sizes});
    
    if(sizes.has(size)){
      sizes.delete(size)
    } else {
      sizes.add(size)
    }

    setValue('sizes',Array.from(sizes))
  }

  const onSubmit = async (data:FormInputs) => {
    console.log({data});

    const formData = new FormData();
    
    const {images, ...productToSave } = data

    if (product.id) {
      formData.append('id', product.id ?? '');
    }
    
    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('gender', productToSave.gender);

    console.log({images});

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }
    


    const {ok, product:updateProduct} = await createUpdateProduct(formData)
    console.log(ok);

    if(!ok){
      alert('no se pudo grabar')
      return
    }

     router.replace(`/admin/product/${updateProduct?.slug}`)
    
  }


  const rules = {
    title:{
      required: 'El título es requerido'
    },
    slug: {
      required: 'El slug es requerido'
    },
    description: {
      required: 'La descripción es requerida'
    },
    price: {
      required: 'El precio es requerido',
      min: 0
    },
    tags: {
      required: 'Los tags son requeridos'
    },
    gender:{
      required: 'El género es requerido'
    },
    categoryId: {
      required: 'La categoría es requerida'
    },
    inStock:{
      required: 'El inventario es requerido',
      min: 0
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('title', rules.title )} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200"  {...register('slug', rules.slug )} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description', rules.description )} 
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200"  {...register('price', rules.price )}  />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('tags', rules.tags )} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('gender', rules.gender )} >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('categoryId', rules.categoryId )}>
            <option value="">[Seleccione]</option>
            {
              categories.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))
            }
          </select>
        </div>

        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">

        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200"  {...register('inStock', rules.inStock )}  />
        </div>
        {/* As checkboxes */}
        <div className="flex flex-col">

          <span>Tallas</span>
          <div className="flex flex-wrap">
            
            {
              sizes.map( size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div key={ size } onClick={() => onSizeChanged(size)} className={clsx(
                  'w-14 h-10 p-2 mr-2 mb-2 border cursor-pointer rounded-md transition-all text-center',
                 {
                  'bg-blue-500 text-white': getValues('sizes').includes(size)
                 }
                )}>
                  <span>{ size }</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Fotos</span>
            <input 
              type="file"
              multiple 
              className="p-2 border rounded-md bg-gray-200" 
              accept="image/png, image/jpeg, image/avif"
              {...register('images')}
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
              product.ProductImage?.map(image => (
                <div key={image.id}>
                 <ProductImage  alt={product.title ?? ''} src={image.url} width={300} height={300} className="rounded-t shadow-sm" />
                  <button onClick={() => deleteProductImage(image.id, image.url)} type="button" className="rounded-b-xl btn-danger w-full"> Eliminar</button>
                </div>
              ))
            }

          </div>

        </div>
      </div>
    </form>
  );
};