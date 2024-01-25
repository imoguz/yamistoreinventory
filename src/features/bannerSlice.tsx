import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IBannerState {
  banners: IBanner[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readBanners = createAsyncThunk<IBanner[]>(
  "banner/readBanners",
  async () => {
    const { data } = await axios<IBanner[]>(
      process.env.REACT_APP_BASE_URL + "/banners"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createBanner = createAsyncThunk<IBanner, INewBanner>(
  "banner/createBanner",
  async (formValue) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + "/banners",
      formValue
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateBanner = createAsyncThunk<
  void,
  { newBanner: INewBanner; id: string }
>("Banner/updateBanner", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/banners/${updatedData.id}`,
    updatedData.newBanner
  );
  return data;
});

// Async thunk middleware for delete
export const deleteBanner = createAsyncThunk<void, string>(
  "banner/deleteBanner",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/banners/${id}`
    );
    return data;
  }
);

const initialState: IBannerState = {
  banners: [],
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    cleanBanners: (state) => {
      state.banners = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readBanners.fulfilled,
        (state, action: PayloadAction<IBanner[]>) => {
          state.loading = false;
          state.banners = action.payload;
        }
      )
      .addCase(readBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "banner read failed.";
      })
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "banner creation failed.";
      })
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "banner deletion failed.";
      });
  },
});

export const { cleanBanners } = bannerSlice.actions;

export const selectBanner = (state: RootState) => state.banner.banners;

export default bannerSlice.reducer;
