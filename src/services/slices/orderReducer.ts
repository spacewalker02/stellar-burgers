import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../../services/store';
import { rejects } from 'assert';
import { stat } from 'fs';

interface OrderState {
  orderData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderData: null,
  orderRequest: false,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to create order');
  }
});

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.isLoading = false;
          state.orderData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.payload || 'Не удалось получить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось получить заказ';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

// селекторы

export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
