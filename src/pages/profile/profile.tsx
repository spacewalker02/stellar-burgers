import { selectUser, updateUser } from '../../services/slices/userReducer';
import { useDispatch } from '../../services/store';
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const user = useSelector(selectUser) || { name: '', email: '' };

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      dispatch(
        updateUser({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password || undefined
        })
      );
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
