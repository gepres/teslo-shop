import { initialData } from "./seed";
import prisma from '../lib/prisma';

async function main () {

  // 1. Borrar registro previo
  // await Promise.all([
  //   prisma.productImage.deleteMany(),
  //   prisma.category.deleteMany(),
  //   prisma.product.deleteMany(),
  // ])


  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const {categories, products} = initialData


  // const categoriesData = categories.map(name => ({name})) // lo mismo
  const categoriesData = categories.map(category => ({
    name: category
  }))

  await prisma.category.createMany({
    data: categoriesData
  });


  const categoriesDB = await prisma.category.findMany()


  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;

  }, {} as Record<string, string>) //<string = shirt, string = categoryId>


  console.log(categoriesMap);



  products.forEach(async (product) => {
    const {type, images, ...rest} = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type]
      }
    })

    const imagesData = images.map( image => ({
      url: image,
      productId: dbProduct.id
    }))

    await prisma.productImage.createMany({
      data: imagesData
    })

  })


}


(() => {

  if(process.env.NODE_ENV === 'production') return;


  main()

})();