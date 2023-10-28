import { Button, Input, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { useAdminStore } from '../../../app/store/store';

export default function Auth() {
  const { isError, authAdmin } = useAdminStore();
  const [password, setPassword] = useState('');

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const submitButtonHandler = () => {
    authAdmin(password);
  }

  return (
    <Stack gap={'sm'}>
      <Input error={Boolean(isError)} onChange={passwordHandler} value={password} placeholder="Пароль" type='password' />
      <Text c='red'>{isError}</Text>
      <Button onClick={submitButtonHandler}>Войти</Button>
    </Stack>
  )
}
