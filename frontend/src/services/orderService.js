import api from "../api/axios";

export const createOrder = (data) =>
  api.post("/orders", data);

export const getOrders = () =>
  api.get("/orders");