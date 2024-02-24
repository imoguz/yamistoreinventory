import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IProductState {
  products: IProduct[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readProducts = createAsyncThunk<IProduct[]>(
  "product/readProducts",
  async () => {
    const { data } = await axios<IProductData>(
      process.env.REACT_APP_BASE_URL + "/products"
    );
    return data.data;
  }
);

// Async thunk middleware for create
export const createProduct = createAsyncThunk<void, INewProduct>(
  "product/createProduct",
  async (newProduct) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/products`,
      newProduct
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateProduct = createAsyncThunk<
  void,
  { newProduct: INewProduct; id: string }
>("product/updateProduct", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/products/${updatedData.id}`,
    updatedData.newProduct
  );
  return data;
});

// Async thunk middleware for delete
export const deleteProduct = createAsyncThunk<void, string>(
  "product/deleteProduct",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/products/${id}`
    );
    return data;
  }
);

const initialState: IProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    cleanProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readProducts.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(readProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Product read failed.";
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Product creation failed.";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Product creation failed.";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Product deletion failed.";
      });
  },
});

export const { cleanProducts } = productSlice.actions;

export const selectProduct = (state: RootState) => state.product.products;

export default productSlice.reducer;
