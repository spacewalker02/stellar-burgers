import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../slices/constructorReducer';
import { TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

const mockedUuid = uuidv4 as jest.MockedFunction<typeof uuidv4>;

const createIngredient = (
  overrides: Partial<TIngredient> = {}
): TIngredient => ({
  _id: 'test-id',
  name: 'Ингредиент',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 50,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...overrides
});

describe('constructorReducer slice', () => {
  beforeEach(() => {
    mockedUuid.mockReset();
  });

  it('должен добавить булку', () => {
    mockedUuid.mockReturnValue('bun-uuid');
    const bun = createIngredient({ type: 'bun', name: 'Булка' });

    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual({
      ...bun,
      id: 'bun-uuid'
    });
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен добавлять начинку в список ингредиентов', () => {
    mockedUuid.mockReturnValue('filling-uuid');
    const filling = createIngredient({ type: 'main', name: 'Начинка' });

    const state = reducer(undefined, addIngredient(filling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...filling,
      id: 'filling-uuid'
    });
  });

  it('должен удалять ингредиент по id', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...createIngredient({ name: 'Первый' }), id: 'id-1' },
        { ...createIngredient({ name: 'Второй' }), id: 'id-2' }
      ]
    };

    const state = reducer(startState, removeIngredient({ id: 'id-1' }));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('id-2');
  });

  it('должен менять порядок ингредиентов', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...createIngredient({ name: 'Первый' }), id: 'id-1' },
        { ...createIngredient({ name: 'Второй' }), id: 'id-2' },
        { ...createIngredient({ name: 'Третий' }), id: 'id-3' }
      ]
    };

    const state = reducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'id-2',
      'id-3',
      'id-1'
    ]);
  });

  it('должен очищать конструктор', () => {
    const startState = {
      bun: {
        ...createIngredient({ type: 'bun', name: 'Булка' }),
        id: 'bun-id'
      },
      ingredients: [{ ...createIngredient({ name: 'Начинка' }), id: 'ing-id' }]
    };

    const state = reducer(startState, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
