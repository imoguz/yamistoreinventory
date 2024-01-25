import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface ICategoryState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readCategories = createAsyncThunk<ICategory[]>(
  "category/readCategories",
  async () => {
    const { data } = await axios<ICategory[]>(
      process.env.REACT_APP_BASE_URL + "/categories/"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createCategory = createAsyncThunk<ICategory, INewCategory>(
  "category/createCategory",
  async (newCategory) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/categories`,
      newCategory
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateCategory = createAsyncThunk<
  void,
  { newCategory: INewCategory; id: string }
>("category/updateCategory", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/categories/${updatedData.id}`,
    updatedData.newCategory
  );

  return data;
});

// Async thunk middleware for delete
export const deleteCategory = createAsyncThunk<void, string>(
  "category/deleteCategory",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/categories/${id}`
    );
    return data;
  }
);

const initialState: ICategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    cleanCategorys: (state) => {
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readCategories.fulfilled,
        (state, action: PayloadAction<ICategory[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(readCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Category read failed.";
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Category creation failed.";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Category deletion failed.";
      });
  },
});

export const { cleanCategorys } = categorySlice.actions;

export const selectCategory = (state: RootState) => state.category.categories;

export default categorySlice.reducer;
