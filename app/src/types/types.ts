export type TokenType = {
  token: string;
}

export type IProduct = {
  id: number,
  name: string,
  thumbnail: string,
  amount: number,
  width: number,
  height: number,
  lenght: number,
  weight: number,
  price: number,
  images: IProductImage[],
  tags: ITag[],
}

export type ITag = {
  id: number,
  name: string;
}

export type IProductImage = {
  id: number,
  filename: string,
}

export type IProductParams = {
  page?: number, 
  length?: [number, number], 
  width?: [number, number], 
  height?: [number, number], 
  weight?: [number, number], 
  price?: [number, number], 
  search?: string, 
  tags?: number[],
}

export type IProductResponse = {
  pages: number,
  products: IProduct[]
}