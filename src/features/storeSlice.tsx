import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface IStoreState {
  stores: IStore[];
  loading: boolean;
  error: string | null;
}
// Async thunk middleware for reading data
export const readStores = createAsyncThunk<IStore[]>(
  "store/readStore",
  async () => {
    const { data } = await axios<IStore[]>(
      process.env.REACT_APP_BASE_URL + "/stores/"
    );
    return data;
  }
);

// Async thunk middleware for create
export const createStore = createAsyncThunk<void, INewStore>(
  "store/createStore",
  async (newStore) => {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + `/stores`,
      newStore
    );
    return data;
  }
);

// Async thunk middleware for update
export const updateStore = createAsyncThunk<
  void,
  { newStore: INewStore; id: string }
>("store/updateStore", async (updatedData) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + `/stores/${updatedData.id}`,
    updatedData.newStore
  );
  return data;
});

// Async thunk middleware for delete
export const deleteStore = createAsyncThunk<void, string>(
  "store/deleteStore",
  async (id) => {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + `/stores/${id}`
    );
    return data;
  }
);

const initialState: IStoreState = {
  stores: [],
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "Store",
  initialState,
  reducers: {
    cleanStores: (state) => {
      state.stores = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readStores.fulfilled,
        (state, action: PayloadAction<IStore[]>) => {
          state.loading = false;
          state.stores = action.payload;
        }
      )
      .addCase(readStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Store read failed.";
      })
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Store creation failed.";
      })
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Store deletion failed.";
      });
  },
});

export const { cleanStores } = storeSlice.actions;

export const selectStore = (state: RootState) => state.store.stores;

export default storeSlice.reducer;
