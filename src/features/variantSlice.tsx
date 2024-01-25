import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IVariantState {
  variants: IVariant[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readVariants = createAsyncThunk<IVariant[]>(
  "variant/readVariants",
  async () => {
    const { data } = await axios<IVariant[]>(
      process.env.REACT_APP_BASE_URL + "/variants/"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createVariant = createAsyncThunk<void, INewVariantForm>(
  "variant/createVariant",
  async (formValues) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/variants`,
      formValues
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateVariant = createAsyncThunk<
  void,
  { newVariant: INewVariantForm; id: string }
>("variant/updateVariant", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/variants/${updatedData.id}`,
    updatedData.newVariant
  );
  return data;
});

// Async thunk middleware for delete
export const deleteVariant = createAsyncThunk<void, string>(
  "variant/deleteVariant",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/variants/${id}`
    );
    return data;
  }
);

const initialState: IVariantState = {
  variants: [],
  loading: false,
  error: null,
};

const variantSlice = createSlice({
  name: "Variant",
  initialState,
  reducers: {
    cleanVariants: (state) => {
      state.variants = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readVariants.fulfilled,
        (state, action: PayloadAction<IVariant[]>) => {
          state.loading = false;
          state.variants = action.payload;
        }
      )
      .addCase(readVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Variant read failed.";
      })
      .addCase(createVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVariant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Variant creation failed.";
      })
      .addCase(deleteVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVariant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Variant deletion failed.";
      });
  },
});

export const { cleanVariants } = variantSlice.actions;

export const selectVariant = (state: RootState) => state.variant.variants;

export default variantSlice.reducer;
