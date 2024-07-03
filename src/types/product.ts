export interface IProductCategory {
  label: string;
  value: string;
  image: string;
  count?: number;
}

// src/types/Product.ts
export interface IProduct {
  _id?: string;
  name: string;
  photo: string;
  category: IProductCategory;
  description: string;
  stock: number;
  price: number;
  discountPrice: number;
  brand: string;
  cell?: string;
  service?: Record<string, unknown>;
  rating?: number;
  tag: string | "";
}
