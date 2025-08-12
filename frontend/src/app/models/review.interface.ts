export interface Review {
  _id?: string;
  userName: string;
  email: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
  productId?: string;
  userId?: string;
  isVerified?: boolean;
  isVisible?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  review?: Review;
  reviews?: Review[];
  totalReviews?: number;
  averageRating?: number;
  statistics?: ReviewStats;
}

export interface CreateReviewRequest {
  userName: string;
  email: string;
  rating: number;
  comment: string;
  productId?: string;
}

export interface UpdateReviewRequest {
  userName?: string;
  email?: string;
  rating?: number;
  comment?: string;
  isVerified?: boolean;
  isVisible?: boolean;
}

export interface RatingStats {
  [key: number]: {
    count: number;
    percentage: number;
  };
}
