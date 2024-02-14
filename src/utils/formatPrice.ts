
export const formatPrice = (price: string) =>
  Intl.NumberFormat("en-in", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(parseInt(price, 10));