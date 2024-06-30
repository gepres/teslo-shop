export interface Product {
  id: string;
  description: string;
  ProductImage: ProductImage[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  // type: Type; // todo: Type
  gender: Gender;
}


export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
}

export interface ProductImage {
  id: number;
  url: string;
  productId?: string;
}

export type Gender = 'men'|'women'|'kid'|'unisex'
export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';