export interface Review {
  id?: number;
  userName: string;
  email: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Product {
  id: number;
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
  inStock: boolean;
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
}
