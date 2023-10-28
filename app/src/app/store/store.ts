import { create } from 'zustand';
import { $authHost, $host } from '../http';
import { IProduct, IProductParams, IProductResponse, TokenType } from '../../types/types';

type AdminStoreType = {
  checkAdmin: () => Promise<void>,
  authAdmin: (password: string) => Promise<void>,
  signOut: () => void,
  isAdmin: boolean,
  isError: string,
}

export const useAdminStore = create<AdminStoreType>((set) => ({
  isAdmin: false,
  isError: '',
  authAdmin: async (password: string) => {
    try {
      const response = await $host.post<TokenType>('/admin/login', { password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      set({ isAdmin: true });
    } catch (error) { 
      set({ isError: 'Неверный пароль!' });
     }
  },
  checkAdmin: async () => {
    try {
      const response = await $authHost.get<TokenType>('/admin/auth');
      const { token } = response.data;
      localStorage.setItem('token', token);
      set({ isAdmin: true });
    } catch (error) { /* empty */ }
  },
  signOut: () => {
    set({isAdmin: false});
    localStorage.removeItem('token');
  }
}))

type ProductStore = {
  getProducts: (params?: IProductParams) => Promise<void>,
  products: IProduct[],
  pages: number,
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  pages: 0,
  getProducts: async (params?: IProductParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      const { page, price, length, weight, width, height, search, tags } = params;
      if (page) {
        searchParams.set('page', encodeToQueryString(page));
      }
      if (price) {
        searchParams.set('price', encodeToQueryString(price));
      }
      if (length) {
        searchParams.set('length', encodeToQueryString(length));
      }
      if (weight) {
        searchParams.set('weight', encodeToQueryString(weight));
      }
      if (width) {
        searchParams.set('width', encodeToQueryString(width));
      }
      if (height) {
        searchParams.set('height', encodeToQueryString(height));
      }
      if (search) {
        searchParams.set('search', encodeToQueryString(search));
      }
      if (tags) {
        searchParams.set('tags', encodeToQueryString(tags));
      }
    }
    const queryString = searchParams.toString();
    const urlString = `/product${queryString ? '?' : ''}${queryString}`;
    const response = await $host.get<IProductResponse>(urlString);
    const { pages, products } = response.data;
    set({ pages, products });
  },
  
}));

function encodeToQueryString(object: object | number | string) {
  return encodeURIComponent(JSON.stringify(object));
}