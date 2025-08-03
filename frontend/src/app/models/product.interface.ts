export interface Review {
  _id?: string;
  userName: string;
  email: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPrice?: number | null;
  description: string;
  detailDescription: string;
  category: string;
  frenchCategory: string;
  image: string;
  images?: string[];
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  material?: string;
  dimensions?: string;
  weight?: string;
  features?: string[];
  style?: string;
  occasion?: string;
  warranty?: string;
  careInstructions?: string;
  reviews?: Review[];
  createdAt?: Date | string; // Date de création
  updatedAt?: Date | string; // Date de modification
}
