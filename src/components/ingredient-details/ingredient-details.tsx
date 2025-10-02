import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredientsById } from '../../services/slices/ingredientsReducer';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();

  const ingredientData = useSelector(
    id ? selectIngredientsById(id) : () => null
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
