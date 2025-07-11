export const API_ROUTES = {
  GET_ITEMS: "/inventory/items/",
  CREATE_ITEM: "/items",
  UPDATE_ITEM: (id: string) => `/items/${id}`,
};