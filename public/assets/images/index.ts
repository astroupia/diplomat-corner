// Define the image type
export interface ImageAsset {
  src: string;
  alt: string;
}

// Export images as objects with proper typing
export const images = {
  air: {
    src: "./air.jpg",
    alt: "Air view",
  },
  air2: {
    src: "./air2.jpg",
    alt: "Air view 2",
  },
  building: {
    src: "./building.jpg",
    alt: "Building",
  },
  cash: {
    src: "./cash.jpg",
    alt: "Cash",
  },
  car: {
    src: "./car.jpg",
    alt: "Car",
  },
  half: {
    src: "./half.jpg",
    alt: "Half view",
  },
  women: {
    src: "./women.jpg",
    alt: "Women",
  },
  placeholder: {
    src: "./placeholder.jpg",
    alt: "Placeholder",
  },
  house_preview: {
    src: "./house_preview.jpg",
    alt: "preview house",
  },
  car_preview: {
    src: "./car_preview.jpg",
    alt: "preview house",
  },
};

// Export a function to safely get an image
export const getImage = (key: keyof typeof images): ImageAsset => {
  return images[key] || images.placeholder;
};
