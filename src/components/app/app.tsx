import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { Modal, OrderInfo, IngredientDetails } from '@components';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsReducer';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { fetchUser, setAuthChecked } from '../../services/slices/userReducer';
import { ProtectedRoute } from '../protected-route/protected-route';

const ModalWrapper = ({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const navigate = useNavigate();

  return (
    <Modal title={title} onClose={() => navigate(-1)}>
      {children}
    </Modal>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state as { background?: Location };

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser()).finally(() => dispatch(setAuthChecked(true)));
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute anonymous>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute anonymous>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute anonymous>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute anonymous>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='/*' element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <ModalWrapper title=''>
                <OrderInfo />
              </ModalWrapper>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <ModalWrapper title='Детали ингредиента'>
                <IngredientDetails />
              </ModalWrapper>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalWrapper title=''>
                  <OrderInfo />
                </ModalWrapper>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
