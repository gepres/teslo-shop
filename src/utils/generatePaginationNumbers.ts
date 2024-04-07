export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
  // si el numero de total de paginas es 7 o menos
  // vamos a mostrar puntos suspencivos

  if(totalPages <= 7) {
    return Array.from({length: totalPages}, (_, i) => i+1)
  }

  // si la pagina actual esta entrre las primeras 3 paginas 
  // mostrar  las primeras 3 , puntos suspencivos y las ultimas 2

  if(currentPage <= 3){
    return [1,2,3,'...', totalPages -1, totalPages]
  }

  // if(currentPage > 3){
  //   return [1,2,3 , '...',totalPages -1, totalPages]
  // }

  // if la pagina actual esta entre las ultimas 
  if(currentPage >= totalPages -2) {
    return [1,2,'...',totalPages-2, totalPages-1, totalPages]
  }

  // si la pagina actua en otr lugar medio

  return [1,'...', currentPage-1,currentPage, currentPage+1, '...', totalPages]
}