// menuitem.tsx
interface IMenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}
// menuitem.tsx
interface ISubMenuItem {
  title: string;
  icon: React.ReactNode;
  path: React.ReactNode;
}

// Slice interfaces
interface IColor {
  _id?: string;
  name: string;
  hex_code: string;
  createdAt: Date;
  updatedAt: Date;
  isNew?: boolean;
}
interface INewColor {
  name: string;
  hex_code: string;
}
interface ISize {
  _id?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isNew?: boolean;
}
interface INewSize {
  name: string;
}
interface IPromotion {
  _id?: string;
  code: number | null;
  description: string;
  type: "monetary" | "percentage" | "";
  amount: number | null;
  min_purchase: number | null;
  expired_date: Date | string | null;
  createdAt: Date;
  updatedAt: Date;
  isNew?: boolean;
}
interface INewPromotion {
  code: number;
  description: string;
  type: "monetary" | "percentage";
  amount: number;
  min_purchase: number;
  expired_date: Date | string | null;
}

interface IDiscount {
  _id?: string;
  type: string;
  amount: number | null;
  start_date: Date | string | null;
  end_date: Date | string | null;
  createdAt: Date;
  updatedAt: Date;
  isNew?: boolean;
}
interface INewDiscount {
  type: string;
  amount: number;
  start_date: Date | string | null;
  end_date: Date | string | null;
}
interface IBrand {
  _id?: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  createdAt: Date;
  updatedAt: Date;
  isNew?: boolean;
}
interface INewBrand {
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
}
interface IStore {
  _id?: string;
  name: string;
  description: string;
  logo_url: string;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
  isNew?: boolean;
}
interface INewStore {
  name: string;
  description: string;
  logo_url: string;
  image_url: string;
}

interface INewBanner {
  _id?: string;
  label: string;
  description: string;
  image_url: string;
  link: string;
  isNew?: boolean;
}

interface IBanner extends INewBanner {
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

interface ICategory {
  _id: string;
  name: string;
  parentCategory?: ICategory;
  createdAt: Date;
  updatedAt: Date;
}
interface INewCategoryForm {
  topCategory: string;
  category: string;
  subCategory: string;
  id: string;
  isEdit: boolean;
}
interface INewCategory {
  name: string;
  parentCategory?: string | null;
}
interface ICategoryList {
  id: string;
  name: string;
  topCategory?: string;
}
interface ICategoryListState {
  topCategories: ICategoryList[];
  categories: ICategoryList[];
}

interface ICategoryRows {
  _id: string;
  topCategory: string;
  category: string;
  subCategory: string;
  createdAt: Date;
  updatedAt: Date;
}
// // confirmDelete interface
interface IConfirmDelete {
  open: boolean;
  isDelete: boolean;
  model: string;
  id?: string | null;
}

// // openCDN
// interface IOpenCDN {
//   open: boolean;
//   link: string | null;
//   confirm: boolean;
// }

// Product
interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: {
    _id: string;
    name: string;
    description: string;
    logo_url: string;
    website_url: string;
    createdAt: Date;
    updatedAt: Date;
  };
  category: {
    _id: string;
    name: string;
    parentCategory: category;
    createdAt: Date;
    updatedAt: Date;
  };

  store: [
    {
      _id: string;
      name: string;
      slug: string;
      description: string;
      image_url: string;
      logo_url: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ];
  price: number;
  discount: {
    _id: string;
    type: string;
    amount: number;
    start_date: Date;
    end_date: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  promotion: {
    _id: string;
    code: string;
    description: string;
    type: string;
    amount: number;
    min_purchase: number;
    expired_date: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  variants: IVariant[];
  reviews: IReviews[];
  images: [
    {
      url: string;
      isMainImage: Boolean;
      _id: string;
    },
    {
      url: string;
      isMainImage: Boolean;
      _id: string;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

interface IVariant {
  color_id: {
    createdAt: Date;
    hex_code: string;
    name: string;
    updatedAt: Date;
    _id: string;
  };
  createdAt: Date;
  image_url: string;
  product_id: IProduct;
  size_id: {
    createdAt: Date;
    name: string;
    updatedAt: Date;
    _id: string;
  };
  stock: number;
  isDefault: boolean;
  updatedAt: Date;
  _id: string;
}

interface INewVariantForm {
  product_id: string;
  size_id: string;
  color_id: string;
  image_url: string;
  stock: number | null;
  isDefault: boolean | null;
}

interface image {
  _id?: string;
  url: string;
  isMainImage: boolean;
}
interface INewProduct {
  id?: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  store: string[];
  price: number | null;
  discount: string;
  promotion: string;
  images: image[];
}

interface IOpenModalState {
  brand: boolean;
  category: boolean;
  store: boolean;
  discount: boolean;
  promotion: boolean;
  cdn: boolean;
}
