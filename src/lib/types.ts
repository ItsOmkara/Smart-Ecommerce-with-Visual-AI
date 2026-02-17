export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    images: string[];
    category: string;
    rating: number;
    reviews: number;
    badge?: string;
    colors?: string[];
    sizes?: string[];
    inStock: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
}

export interface Category {
    id: number;
    name: string;
    image: string;
    count: number;
}

export interface SearchResult {
    product: Product;
    similarity: number;
}
