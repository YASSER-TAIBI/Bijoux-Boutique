export interface User {
  _id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role?: string; // Rôle de l'utilisateur (admin, user, etc.)
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
