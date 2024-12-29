export interface ProductCardProps {
  lengths: number;
}
export interface ProductCardSliceProps {
  id: string; // or number, depending on your use case
  name: string;
}
export interface ProductSaleProps {
  id: number;
  name: string;
  article: string;
  category_id: number;
  price: number;
  discount: number;
  seens: number;
  images: [
    {
      id: number;
      url: string;
      is_video: boolean;
    }
  ];
  quantity: number;
  created_at: string;
  size: string;
  color: string;
  average_rating: string;
}
export interface ProductSaleInfoProps {
  id: number;
  name: string;
  article: string;
  category_id: number;
  price: number;
  discount: number;
  seens: number;
  average_rating: string;
  info: string;
  colors: [
    {
      id: number;
      color_code: string;
      image: string;
    }
  ];
  sizes: [
    {
      id: number;
      size: string;
      size_price: number;
    }
  ];
  images: [
    {
      id: number;
      image_path: string;
      url: string;
      is_video: boolean;
    }
  ];
  total_price: number;
  quantity: number;
  size: string;
  color: string;
  created_at: string;
}
export interface ProductBannerProps {
  title: string;
  link: string;
  image_path: string;
  created_at: string;
}
export interface ProductCategoryProps {
  id: number | string;
  name_uz: string;
  name_ru: string;
  image_path: string;
  created_at: string;
}
export interface UserAddressProps {
  id: number;
  name: string;
  long_lat: string;
}
export interface UserOrdersProps {
  id: number;
  user: {
    id: number;
    name: string;
    chat_id: number;
    phone: string;
    photo: string;
  };
  payment_type: {
    id: number;
    name: string;
    image_path: string;
  };
  payment_status: string;
  items: {
    total_price: number;
    total_quantity: number;
  };
  delivery_method: string;
  promo_code: null;
  status: string;
  created_at: string;
}

export interface FilterOptionProps {
  colors: [string];
  sizes: [string];
  price_range: {
    min: number;
    max: number;
  };
}

export interface PaymentProps {
  id: number;
  modal?: boolean;
  payment_status: string;
}

export interface SiteInfoProps {
  open_time: string;
  close_time: string;
  social: [
    {
      name: string;
      url: string;
    },
    {
      name: string;
      url: string;
    }
  ];
  call: [
    {
      name: string;
      url: string;
    },
    {
      name: string;
      url: string;
    }
  ];
  info: string;
  pickup_address: {
    name: string;
    longlat: string;
  };
}
export interface RatingTypes {
  id: number;
  product_id: number;
  user: {
    id: number;
    name: string;
    phone: string;
    photo: string;
  };
  rating: "5.0";
  description: "Ajoyib";
  created_at: string;
}
