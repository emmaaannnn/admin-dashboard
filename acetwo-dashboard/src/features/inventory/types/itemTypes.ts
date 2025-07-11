export type ClothingType =
  | "T Shirt"
  | "Pants"
  | "Shorts"
  | "Outerwear"
  | "Hoodie"
  | "Jumper"
  | "Accessories";

export interface Item {
  base_id: string;
  name: string;
  description?: string;

  sizes: string[];
  size_ids: Record<string, string>;

  size_quantities: Record<string, number>;
  size_prices: Record<string, number>;

  size_sale_prices?: Record<string, number>;
  size_sale_percents?: Record<string, number>;

  sale_price?: number;
  sale_percent?: number;

  is_available: boolean;
  is_archived: boolean;
  image_urls: string[];
  last_updated: string;
  collection?: string;
  clothing_type: ClothingType;

  is_on_sale: boolean;
  is_out_of_stock: boolean;
  display_price: number;
}
