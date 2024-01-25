import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface ISizeState {
  sizes: ISize[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readSizes = createAsyncThunk<ISize[]>(
  "size/readSizes",
  async () => {
    const { data } = await axios<ISize[]>(
      process.env.REACT_APP_BASE_URL + "/sizes/"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createSize = createAsyncThunk<void, INewSize>(
  "size/createSize",
  async (newSize) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/sizes`,
      newSize
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateSize = createAsyncThunk<
  void,
  { newSize: INewSize; id: string }
>("size/updateSize", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/sizes/${updatedData.id}`,
    updatedData.newSize
  );
  return data;
});

// Async thunk middleware for delete
export const deleteSize = createAsyncThunk<void, string>(
  "size/deleteSize",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/sizes/${id}`
    );
    return data;
  }
);

const initialState: ISizeState = {
  sizes: [],
  loading: false,
  error: null,
};

const sizeSlice = createSlice({
  name: "size",
  initialState,
  reducers: {
    cleanSizes: (state) => {
      state.sizes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readSizes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readSizes.fulfilled, (state, action: PayloadAction<ISize[]>) => {
        state.loading = false;
        state.sizes = action.payload;
      })
      .addCase(readSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Size read failed.";
      })
      .addCase(createSize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSize.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Size creation failed.";
      })
      .addCase(deleteSize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSize.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Size deletion failed.";
      });
  },
});

export const { cleanSizes } = sizeSlice.actions;

export const selectSize = (state: RootState) => state.size.sizes;

export default sizeSlice.reducer;
