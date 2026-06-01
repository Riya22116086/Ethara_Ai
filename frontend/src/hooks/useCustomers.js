import { useState, useCallback } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/customers");
      setCustomers(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomer = async (customerData) => {
    try {
      const res = await api.post("/customers", customerData);
      setCustomers((prev) => [...prev, res.data]);
      toast.success("Customer registered successfully");
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const removeCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Customer profile deleted");
    } catch (err) {
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    removeCustomer,
  };
}
