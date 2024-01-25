import { configureStore } from "@reduxjs/toolkit";
import colorReducer from "../features/colorSlice";
import sizeReducer from "../features/sizeSlice";
import promotionReducer from "../features/promotionSlice";
import discountReducer from "../features/discountSlice";
import categoryReducer from "../features/categorySlice";
import variantReducer from "../features/variantSlice";
import brandReducer from "../features/brandSlice";
import storeReducer from "../features/storeSlice";
import bannerReducer from "../features/bannerSlice";
import productReducer from "../features/productSlice";

export const store = configureStore({
  reducer: {
    color: colorReducer,
    size: sizeReducer,
    promotion: promotionReducer,
    discount: discountReducer,
    category: categoryReducer,
    variant: variantReducer,
    brand: brandReducer,
    store: storeReducer,
    banner: bannerReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
