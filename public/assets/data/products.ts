// Define the product type
export interface Product {
  tag: string;
  rating: number;
  reviews: number;
}

// Export products as objects with proper typing
export const products = {
  house1: {
    tag: "House For Rent",
    rating: 4.95,
    reviews: 22,
  },
  car1: {
    tag: "Car For Sale",
    rating: 4.25,
    reviews: 22,
  },
  house2: {
    tag: "House For Rent",
    rating: 3.95,
    reviews: 22,
  },
  car2: {
    tag: "Car For Sale",
    rating: 4.6,
    reviews: 22,
  },
  car3: {
    tag: "Car For Sale",
    rating: 4.3,
    reviews: 22,
  },
  placeholder: {
    tag: "Unknown",
    rating: 0,
    reviews: 0,
  },
};

// Export a function to safely get a product
export const getProduct = (key: keyof typeof products): Product => {
  return products[key] || products.placeholder;
};
