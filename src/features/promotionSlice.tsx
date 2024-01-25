import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IPromotionState {
  promotions: IPromotion[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readPromotions = createAsyncThunk<IPromotion[]>(
  "promotion/readPromotions",
  async () => {
    const { data } = await axios<IPromotion[]>(
      process.env.REACT_APP_BASE_URL + "/promotions"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createPromotion = createAsyncThunk<void, INewPromotion>(
  "promotion/createPromotion",
  async (newPromotion) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/promotions`,
      newPromotion
    );
    return data;
  }
);

// Async thunk middleware for update
export const updatePromotion = createAsyncThunk<
  void,
  { newPromotion: INewPromotion; id: string }
>("promotion/updatePromotion", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/promotions/${updatedData.id}`,
    updatedData.newPromotion
  );
  return data;
});

// Async thunk middleware for delete
export const deletePromotion = createAsyncThunk<void, string>(
  "promotion/deletePromotion",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/promotions/${id}`
    );
    return data;
  }
);

const initialState: IPromotionState = {
  promotions: [],
  loading: false,
  error: null,
};

const promotionSlice = createSlice({
  name: "Promotion",
  initialState,
  reducers: {
    cleanPromotions: (state) => {
      state.promotions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readPromotions.fulfilled,
        (state, action: PayloadAction<IPromotion[]>) => {
          state.loading = false;
          state.promotions = action.payload;
        }
      )
      .addCase(readPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Promotion read failed.";
      })
      .addCase(createPromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPromotion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Promotion creation failed.";
      })
      .addCase(deletePromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePromotion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Promotion deletion failed.";
      });
  },
});

export const { cleanPromotions } = promotionSlice.actions;

export const selectPromotion = (state: RootState) => state.promotion.promotions;

export default promotionSlice.reducer;
