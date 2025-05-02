// Re-export images and products from the public directory
// This creates a more reliable way to import these assets

export { images, getImage, type ImageAsset } from "../../public/assets/images";
export {
  products,
  getProduct,
  type Product,
} from "../../public/assets/data/products";
