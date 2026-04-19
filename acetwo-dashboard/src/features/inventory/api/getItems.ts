import axios from "axios";
import type { Item } from "../types/itemTypes";
import { API_ROUTES } from "../../../routes/inventoryRoute";

const BASE_URL = "http://localhost:8000"; // Match backend port

export const getItems = async (): Promise<Item[]> => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.GET_ITEMS}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};
