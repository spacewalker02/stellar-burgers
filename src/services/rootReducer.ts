import { combineReducers } from '@reduxjs/toolkit';

// импорт слайсов
import ingredientsReducer from './slices/ingredientsReducer';
import constructorReducer from './slices/constructorReducer';
import orderReducer from './slices/orderReducer';
import feedReducer from './slices/feedReducer';
import userReducer from './slices/userReducer';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer
});
