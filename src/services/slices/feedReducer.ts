import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';
import { stat } from 'fs';
import { act } from 'react-dom/test-utils';
import { RootState } from '@services/store';

interface FeedState {
  feed: TOrdersData | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  feed: null,
  orders: [],
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Не удалось загрузить ленту');
    }
  }
);

export const fetchOrders = createAsyncThunk('feed/fetchOrders', async () => {
  const data = await getOrdersApi();
  return data;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.feed = action.payload;
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Не удалось загрузить ленту';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });
  }
});

export default feedSlice.reducer;

// селекторы

export const selectFeed = (state: { feed: FeedState }) => state.feed.feed;
export const selectFeedOrders = (state: { feed: FeedState }) =>
  state.feed.orders;
export const selectFeedLoading = (state: { feed: FeedState }) =>
  state.feed.isLoading;
export const selectFeedError = (state: { feed: FeedState }) => state.feed.error;
