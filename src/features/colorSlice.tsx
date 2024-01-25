import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IColorState {
  colors: IColor[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readColors = createAsyncThunk<IColor[]>(
  "color/readColors",
  async () => {
    const { data } = await axios<IColor[]>(
      process.env.REACT_APP_BASE_URL + "/colors"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createColor = createAsyncThunk<void, INewColor>(
  "color/createColor",
  async (newColor) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/colors`,
      newColor
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateColor = createAsyncThunk<
  void,
  { newColor: INewColor; id: string }
>("color/updateColor", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/colors/${updatedData.id}`,
    updatedData.newColor
  );
  return data;
});

// Async thunk middleware for delete
export const deleteColor = createAsyncThunk<void, string>(
  "color/deleteColor",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/colors/${id}`
    );
    return data;
  }
);

const initialState: IColorState = {
  colors: [],
  loading: false,
  error: null,
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    cleanColors: (state) => {
      state.colors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readColors.fulfilled,
        (state, action: PayloadAction<IColor[]>) => {
          state.loading = false;
          state.colors = action.payload;
        }
      )
      .addCase(readColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Color read failed.";
      })
      .addCase(createColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createColor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Color creation failed.";
      })
      .addCase(deleteColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteColor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Color deletion failed.";
      });
  },
});

export const { cleanColors } = colorSlice.actions;

export const selectColor = (state: RootState) => state.color.colors;

export default colorSlice.reducer;
