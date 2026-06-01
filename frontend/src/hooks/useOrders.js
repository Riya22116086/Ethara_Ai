import { useState, useCallback } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = async (orderData) => {
    try {
      const res = await api.post("/orders", orderData);
      setOrders((prev) => [...prev, res.data]);
      toast.success("Order created successfully");
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const removeOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order deleted successfully");
    } catch (err) {
      throw err;
    }
  };

  const getOrderDetails = async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    removeOrder,
    getOrderDetails,
  };
}
