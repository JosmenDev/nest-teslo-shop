import { Product } from "../entities";
import { ProductResponse } from "../interfaces/product-response.interface";

export const transformProduct = (product: Product): ProductResponse => {
  const {images = [], ...productDetails } = product;
  return {...productDetails, images: images.map(image => image.url)};
}