import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  products: Product[];
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stockLevel: number;
  image: string;
  shopId: string;
}

export const shopApi = {
  getAll: () => api.get<Shop[]>("/shops"),
  getById: (id: number) => api.get<Shop>(`/shops/${id}`),
  create: (data: Omit<Shop, "id">) => api.post<Shop>("/shops", data),
  update: (id: string, data: Partial<Shop>) => api.put<Shop>(`/shops/${id}`, data),
  delete: (id: number) => api.delete(`/shops/${id}`),
  addProduct: async (shopId: string, product: Omit<Product, 'id'>) => {
    const shop = (await api.get<Shop>(`/shops/${shopId}`)).data;
    const updatedShop = {
      ...shop,
      products: [...shop.products, { ...product, shopId }]
    };
    return api.put<Shop>(`/shops/${shopId}`, updatedShop);
  },
  removeProduct: async (shopId: string, productId: string) => {
    const shop = (await api.get<Shop>(`/shops/${shopId}`)).data;
    const updatedShop = {
      ...shop,
      products: shop.products.filter(p => p.id !== productId)
    };
    return api.put<Shop>(`/shops/${shopId}`, updatedShop);
  }
};

export const productApi = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, "id">) => api.post<Product>("/products", data),
  update: (id: number, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};
