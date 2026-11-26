
export function parsePrice(price: string): number {

  // Remove dollar sign and commas
  const cleanedPrice = price.replace(/[$,]/g, '');

  // Convert string into number
  return Number(cleanedPrice);
}
