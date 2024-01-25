import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IBrandState {
  brands: IBrand[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readBrands = createAsyncThunk<IBrand[]>(
  "brand/readBrand",
  async () => {
    const { data } = await axios<IBrand[]>(
      process.env.REACT_APP_BASE_URL + "/brands/"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createBrand = createAsyncThunk<void, INewBrand>(
  "brand/createBrand",
  async (newBrand) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/brands`,
      newBrand
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateBrand = createAsyncThunk<
  void,
  { newBrand: INewBrand; id: string }
>("brand/updateBrand", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/brands/${updatedData.id}`,
    updatedData.newBrand
  );
  return data;
});

// Async thunk middleware for delete
export const deleteBrand = createAsyncThunk<void, string>(
  "brand/deleteBrand",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/brands/${id}`
    );
    return data;
  }
);

const initialState: IBrandState = {
  brands: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    cleanBrands: (state) => {
      state.brands = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readBrands.fulfilled,
        (state, action: PayloadAction<IBrand[]>) => {
          state.loading = false;
          state.brands = action.payload;
        }
      )
      .addCase(readBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Brand read failed.";
      })
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Brand creation failed.";
      })
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Brand deletion failed.";
      });
  },
});

export const { cleanBrands } = brandSlice.actions;

export const selectBrand = (state: RootState) => state.brand.brands;

export default brandSlice.reducer;
