import { useState, useCallback } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData) => {
    try {
      const res = await api.post("/products", productData);
      setProducts((prev) => [...prev, res.data]);
      toast.success("Product created successfully");
      return res.data;
    } catch (err) {
      // Interceptor handles the toast, we just rethrow so the form can handle it
      throw err;
    }
  };

  const editProduct = async (id, productData) => {
    try {
      const res = await api.put(`/products/${id}`, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? res.data : p))
      );
      toast.success("Product updated successfully");
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const removeProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}
