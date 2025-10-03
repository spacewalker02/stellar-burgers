import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/slices/constructorReducer';
import { clearConstructor } from '../../services/slices/constructorReducer';
import {
  createOrder,
  clearOrder,
  selectOrderRequest,
  selectOrderData
} from '../../services/slices/orderReducer';
import { selectUser } from '../../services/slices/userReducer';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ingredients: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item.id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredients));
  };

  const closeOrderModal = () => {
    if (orderModalData) {
      dispatch(clearConstructor());
      dispatch(clearOrder());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
        constructorItems.ingredients?.reduce(
          (s: number, v: TConstructorIngredient) => s + v.price,
          0
        ) ?? 0,
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
