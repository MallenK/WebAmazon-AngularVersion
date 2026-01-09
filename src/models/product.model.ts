
export interface Product {
  id: string;
  name: string;
  title: string | null;
  asin: string | null;
  image_url: string | null;
  amazon_url: string;
  price: string | null;
  old_price: string | null;
  rating_num: string | null;
  rating_text: string | null;
  reviews_count: string | null;
  bought_last_month: string | null;
  is_sponsored: boolean;
  is_active: boolean;
}
