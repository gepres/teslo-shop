export const currencyFormat = (value?:number | any) => {
  return  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits:2,
    maximumFractionDigits:2
  }).format(value)
}