// lib/api/navigation.ts
import axios from "axios";
import { NavigationItemFormValues } from "@/lib/validations/navigation";

const API_URL = "/api/navigation";

export const getNavigationItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createNavigationItem = async (data: NavigationItemFormValues) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateNavigationItem = async (id: string, data: NavigationItemFormValues) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteNavigationItem = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
