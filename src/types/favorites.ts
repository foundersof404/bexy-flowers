export interface FavoriteProduct {
  id: number | string;
  title: string;
  price: number;
  image: string;
  imageUrl?: string;
  description?: string;
  category?: string;
  featured?: boolean;
  name?: string; // Alias for title in some components
}

export interface FavoritesContextType {
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (productId: number | string) => void;
  isFavorite: (productId: number | string) => boolean;
  toggleFavorite: (product: FavoriteProduct) => void;
  getTotalFavorites: () => number;
  clearFavorites: () => void;
}

