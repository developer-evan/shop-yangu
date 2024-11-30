import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export interface Shop {
  products: string;
  id?: number;
  name: string;
  description: string;
  logo: string;
}

export interface Product {
  id?: number;
  shopId?: number;
  name: string;
  price: number;
  stockLevel: number;
  description: string;
  image: string;
}

export const shopApi = {
  getAll: () => api.get<Shop[]>("/shops"),
  getById: (id: number) => api.get<Shop>(`/shops/${id}`),
  create: (data: Omit<Shop, "id">) => api.post<Shop>("/shops", data),
  update: (id: number, data: Partial<Shop>) =>
    api.put<Shop>(`/shops/${id}`, data),
  delete: (id: number) => api.delete(`/shops/${id}`),
};

export const productApi = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, "id">) => api.post<Product>("/products", data),
  update: (id: number, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};
