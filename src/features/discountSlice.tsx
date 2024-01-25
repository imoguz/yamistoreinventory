import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IDiscountState {
  discounts: IDiscount[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readDiscounts = createAsyncThunk<IDiscount[]>(
  "discount/readDiscount",
  async () => {
    const { data } = await axios<IDiscount[]>(
      process.env.REACT_APP_BASE_URL + "/discounts/"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createDiscount = createAsyncThunk<void, INewDiscount>(
  "discount/createDiscount",
  async (newDiscount) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/discounts`,
      newDiscount
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateDiscount = createAsyncThunk<
  void,
  { newDiscount: INewDiscount; id: string }
>("discount/updateDiscount", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/discounts/${updatedData.id}`,
    updatedData.newDiscount
  );
  return data;
});

// Async thunk middleware for delete
export const deleteDiscount = createAsyncThunk<void, string>(
  "discount/deleteDiscount",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/discounts/${id}`
    );
    return data;
  }
);

const initialState: IDiscountState = {
  discounts: [],
  loading: false,
  error: null,
};

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    cleanDiscounts: (state) => {
      state.discounts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readDiscounts.fulfilled,
        (state, action: PayloadAction<IDiscount[]>) => {
          state.loading = false;
          state.discounts = action.payload;
        }
      )
      .addCase(readDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Discount read failed.";
      })
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Discount creation failed.";
      })
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiscount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Discount deletion failed.";
      });
  },
});

export const { cleanDiscounts } = discountSlice.actions;

export const selectDiscount = (state: RootState) => state.discount.discounts;

export default discountSlice.reducer;
