import { error } from 'console';
import reducer, {
  fetchIngredients
} from '../slices/ingredientsReducer';
import { TIngredient } from '@utils-types';
import { stat } from 'fs';
import exp from 'constants';

describe('ingredientsReducer', () => {
  const initialState = {
    items: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  };

  it('устанавливает loading = true при загрузке', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.items).toEqual([]);
  });

  it('при успешной загрузке данные записываются в стор', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка тестовая',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 200,
        price: 100,
        image: 'mock.jpg',
        image_mobile: 'mock-mobile.jpg',
        image_large: 'mock-large.jpg'
      }
    ];

    const state = reducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('при ошибке загрузки она записывается в стор', () => {
    const errorMessage = 'Ошибка загрузки';

    const state = reducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.items).toEqual([]);
  });
});
