import { Button, Center, Code, Stack, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { useAdminStore, useProductStore } from '../../app/store/store';
import Auth from './auth/auth';

export default function Admin() {
  const [isCheck, setIsCheck] = useState(true);
  const { isAdmin, checkAdmin, signOut } = useAdminStore()
  const { products, getProducts } = useProductStore();

  useEffect(() => {
    checkAdmin()
      .then(() => {
        setIsCheck(false);
      });
  }, [checkAdmin])

  useEffect(() => {
    if (isAdmin) {
      getProducts()
    }
  }, [getProducts, isAdmin]);

  if (isCheck) {
    return (
      <Center p={'xl'}>
        <Title order={2}>Загрузка</Title>
      </Center>
    )
  }

  if (!isAdmin) {
    return (
      <Center p={'xl'}>
        <Auth></Auth>
      </Center>
    )
  }

  return (
    <Center p={'xl'}>
        <Stack>
          <Button onClick={signOut}>Выйти</Button>
          <Code style={{ whiteSpace: 'break-spaces' }}>
            {JSON.stringify(products, null, 2)}
          </Code>
        </Stack>
    </Center>
  )
}
